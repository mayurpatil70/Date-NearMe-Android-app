const { pool } = require('../config/db');

module.exports = (io) => {
    io.on('connection', (socket) => {
        
        socket.on('join', (userId) => {
            socket.join(userId);
        });

        socket.on('send_message', async ({ senderId, receiverId, message }) => {
            try {
                // 1. Verify there is an ACTIVE chat session between these two users
                const sessionRes = await pool.query(
                    `SELECT id, status FROM chat_sessions 
                     WHERE ((user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1))`,
                    [senderId, receiverId]
                );

                if (sessionRes.rows.length === 0) {
                    return socket.emit('chat_error', { message: 'No match found.' });
                }

                const session = sessionRes.rows[0];

                if (session.status !== 'ACTIVE') {
                    return socket.emit('chat_error', { 
                        message: 'Chat is locked. Both users must approve audio prompts first.' 
                    });
                }

                // 2. Deliver message
                const receiverSockets = await io.in(receiverId).fetchSockets();
                
                if (receiverSockets.length > 0) {
                    io.to(receiverId).emit('receive_message', { senderId, message, timestamp: new Date() });
                } else {
                    // Fallback to FCM Push Notification if receiver is offline
                    // require('firebase-admin').messaging().send(...)
                }

                // 3. Update the last_message_at timestamp for Anti-Ghosting State Machine
                await pool.query(
                    "UPDATE chat_sessions SET last_message_at = NOW() WHERE id = $1", 
                    [session.id]
                );

            } catch (err) {
                console.error("Socket send error:", err);
            }
        });
    });
};