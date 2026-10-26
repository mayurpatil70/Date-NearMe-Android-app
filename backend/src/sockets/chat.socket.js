const { pool } = require("../config/db");

// In-memory active presence tracker (maps userId -> Set of socket IDs)
const activeUserSockets = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    let currentUserId = null;

    // 1. User joins their personal notification & messaging room
    socket.on("join", async (userId) => {
      if (!userId) return;
      currentUserId = String(userId);
      socket.join(currentUserId);

      // Track socket connection for presence
      if (!activeUserSockets.has(currentUserId)) {
        activeUserSockets.set(currentUserId, new Set());
      }
      activeUserSockets.get(currentUserId).add(socket.id);

      // Broadcast presence: user is online
      io.emit("user_presence", {
        userId: currentUserId,
        status: "online",
        timestamp: new Date(),
      });

      // Automatically sync any offline notifications waiting for this user
      try {
        const offlineRes = await pool.query(
          `SELECT id, sender_id, sender_name, sender_avatar, message_preview, created_at 
           FROM offline_notifications 
           WHERE user_id = $1 AND is_read = FALSE 
           ORDER BY created_at DESC LIMIT 20`,
          [currentUserId]
        );

        if (offlineRes.rows.length > 0) {
          socket.emit("offline_notifications_sync", {
            count: offlineRes.rows.length,
            notifications: offlineRes.rows,
          });
        }
      } catch (err) {
        console.error("Error syncing offline notifications on join:", err.message);
      }
    });

    // 2. Fetch offline notifications on demand
    socket.on("get_offline_notifications", async ({ userId }, callback) => {
      try {
        const uid = String(userId || currentUserId);
        const result = await pool.query(
          `SELECT id, sender_id, sender_name, sender_avatar, message_preview, created_at 
           FROM offline_notifications 
           WHERE user_id = $1 AND is_read = FALSE 
           ORDER BY created_at DESC LIMIT 20`,
          [uid]
        );

        const data = {
          count: result.rows.length,
          notifications: result.rows,
        };

        socket.emit("offline_notifications_sync", data);
        if (typeof callback === "function") callback(data);
      } catch (err) {
        console.error("Error in get_offline_notifications:", err.message);
        if (typeof callback === "function") callback({ error: err.message, notifications: [] });
      }
    });

    // 3. Real-time Message Sending & Offline Notification Routing
    socket.on(
      "send_message",
      async (
        {
          senderId,
          receiverId,
          message,
          senderName = "A Match",
          senderAvatar = "",
          sessionId = null,
        },
        ackCallback
      ) => {
        try {
          if (!senderId || !receiverId || !message || !message.trim()) {
            if (typeof ackCallback === "function") {
              ackCallback({ error: "Missing required message parameters." });
            }
            return;
          }

          const sId = String(senderId);
          const rId = String(receiverId);
          const text = message.trim();
          const timestamp = new Date();

          // A. Persist in database chat_messages table
          let savedMessageId = null;
          try {
            const insertRes = await pool.query(
              `INSERT INTO chat_messages (session_id, sender_id, receiver_id, message, is_delivered) 
               VALUES ($1, $2, $3, $4, $5) 
               RETURNING id, created_at`,
              [sessionId, sId, rId, text, false]
            );
            if (insertRes.rows.length > 0) {
              savedMessageId = insertRes.rows[0].id;
            }
          } catch (dbErr) {
            console.warn("DB message persistence warning (continuing real-time):", dbErr.message);
          }

          // B. Check if Receiver is Online
          const receiverRoom = io.sockets.adapter.rooms.get(rId);
          const isReceiverOnline = receiverRoom && receiverRoom.size > 0;

          const messagePayload = {
            id: savedMessageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            senderId: sId,
            receiverId: rId,
            message: text,
            senderName,
            senderAvatar,
            sessionId,
            timestamp,
            isOnlineDelivery: isReceiverOnline,
          };

          if (isReceiverOnline) {
            // Deliver message directly to receiver in real-time
            io.to(rId).emit("receive_message", messagePayload);

            // Also emit high-priority in-app notification banner
            io.to(rId).emit("new_message_notification", {
              id: messagePayload.id,
              senderId: sId,
              senderName,
              senderAvatar,
              message: text,
              timestamp,
              type: "DIRECT_MESSAGE",
            });

            // Mark delivered in database
            if (savedMessageId) {
              pool
                .query("UPDATE chat_messages SET is_delivered = TRUE WHERE id = $1", [
                  savedMessageId,
                ])
                .catch(() => {});
            }

            // Confirm delivery back to sender
            socket.emit("message_delivered", {
              id: messagePayload.id,
              receiverId: rId,
              timestamp,
            });
          } else {
            // C. Receiver is OFFLINE: Queue offline notification
            try {
              await pool.query(
                `INSERT INTO offline_notifications 
                  (user_id, sender_id, sender_name, sender_avatar, message_preview) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [rId, sId, senderName, senderAvatar, text.slice(0, 200)]
              );
            } catch (queueErr) {
              console.warn("Offline notification queue warning:", queueErr.message);
            }
          }

          // D. Update session last_message_at for Anti-Ghosting escrow clock
          if (sessionId) {
            pool
              .query(
                "UPDATE chat_sessions SET last_message_at = NOW() WHERE id::text = $1 OR id::text = $2",
                [sessionId, sessionId]
              )
              .catch(() => {});
          }

          // Acknowledgement callback to sender
          if (typeof ackCallback === "function") {
            ackCallback({
              status: "success",
              id: messagePayload.id,
              delivered: isReceiverOnline,
              offlineQueued: !isReceiverOnline,
            });
          }
        } catch (err) {
          console.error("Socket send_message fatal error:", err);
          if (typeof ackCallback === "function") {
            ackCallback({ error: "Failed to deliver message." });
          }
        }
      }
    );

    // 4. Typing Indicators
    socket.on("typing_start", ({ senderId, receiverId, senderName }) => {
      if (receiverId) {
        io.to(String(receiverId)).emit("user_typing", {
          senderId,
          senderName: senderName || "Your match",
          isTyping: true,
        });
      }
    });

    socket.on("typing_stop", ({ senderId, receiverId }) => {
      if (receiverId) {
        io.to(String(receiverId)).emit("user_typing", {
          senderId,
          isTyping: false,
        });
      }
    });

    // 5. Mark messages & notifications as read
    socket.on("mark_messages_read", async ({ userId, senderId }) => {
      try {
        const uId = String(userId || currentUserId);
        const sId = String(senderId);

        await pool.query(
          "UPDATE chat_messages SET is_read = TRUE WHERE receiver_id = $1 AND sender_id = $2",
          [uId, sId]
        );
        await pool.query(
          "UPDATE offline_notifications SET is_read = TRUE WHERE user_id = $1 AND sender_id = $2",
          [uId, sId]
        );

        // Notify sender that their messages were read (blue double tick)
        io.to(sId).emit("messages_read_by_peer", {
          readBy: uId,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Error in mark_messages_read:", err.message);
      }
    });

    // 6. Handle Disconnect & Presence cleanup
    socket.on("disconnect", () => {
      if (currentUserId && activeUserSockets.has(currentUserId)) {
        const userSet = activeUserSockets.get(currentUserId);
        userSet.delete(socket.id);
        if (userSet.size === 0) {
          activeUserSockets.delete(currentUserId);
          // User is fully offline
          io.emit("user_presence", {
            userId: currentUserId,
            status: "offline",
            lastSeen: new Date(),
          });
        }
      }
    });
  });
};
