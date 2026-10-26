"use client";

import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [offlineNotifications, setOfflineNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Request browser Notification permissions on user interaction
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      const getSocketUrl = () => {
        if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
        if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
        if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
        if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");
        if (
          typeof window !== "undefined" &&
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1"
        ) {
          return "https://date-near-me-android-app-backend.vercel.app";
        }
        return "http://localhost:5000";
      };

      const rawUrl = getSocketUrl();

      // Modern Dating App Standard: Polling upgrade to WebSocket (100% resilient across proxies)
      const newSocket = io(rawUrl, {
        transports: ["polling", "websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
        timeout: 8000,
        autoConnect: true,
      });

      newSocket.on("connect_error", () => {
        // Handled silently to prevent uncaught exceptions on environments without active socket server
      });

      newSocket.on("connect", () => {
        const userId = user.id || user._id || "user_guest";
        // 1. Join personal notification room
        newSocket.emit("join", userId);

        // 2. Request offline notifications sync
        newSocket.emit("get_offline_notifications", { userId });
      });

      // 3. Receive Missed Messages / Offline Notifications
      newSocket.on("offline_notifications_sync", (data) => {
        if (data && data.notifications && data.notifications.length > 0) {
          setOfflineNotifications(data.notifications);
          setUnreadCount(data.count || data.notifications.length);

          const first = data.notifications[0];
          toast(
            `🔔 You received ${data.notifications.length} message${
              data.notifications.length > 1 ? "s" : ""
            } while offline! Last from ${first.sender_name || "a Match"}: "${first.message_preview || ""}"`,
            {
              duration: 6000,
              icon: "💬",
            }
          );
        }
      });

      // 4. Real-time Incoming Message Alert
      newSocket.on("new_message_notification", (notif) => {
        setUnreadCount((prev) => prev + 1);
        setOfflineNotifications((prev) => [notif, ...prev]);

        // Browser Native Notification if tab in background
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted" &&
          document.hidden
        ) {
          try {
            new Notification(`${notif.senderName || "New Match"} on Date-NearMe`, {
              body: notif.message,
              icon: notif.senderAvatar || "/logo.png",
              tag: `chat_${notif.senderId}`,
            });
          } catch (e) {}
        }

        // In-app interactive toast notification
        toast(
          `💬 ${notif.senderName || "Match"}: "${notif.message.slice(0, 50)}${
            notif.message.length > 50 ? "..." : ""
          }"`,
          {
            duration: 5000,
            icon: "✨",
          }
        );
      });

      // 5. Real-time User Presence updates
      newSocket.on("user_presence", ({ userId, status }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (status === "online") next.add(userId);
          else next.delete(userId);
          return next;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setUnreadCount(0);
      setOfflineNotifications([]);
    }
  }, [user]);

  const markChatAsRead = (senderId) => {
    if (socket && user) {
      socket.emit("mark_messages_read", {
        userId: user.id || user._id,
        senderId,
      });
    }
    setOfflineNotifications((prev) =>
      prev.filter((n) => n.sender_id !== senderId && n.senderId !== senderId)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        unreadCount,
        offlineNotifications,
        onlineUsers,
        markChatAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
