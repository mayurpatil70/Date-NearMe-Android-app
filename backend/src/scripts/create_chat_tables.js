require("dotenv").config();
const { pool } = require("../config/db");

async function migrateChatTables() {
  console.log("Migrating chat_messages and offline_notifications tables...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(100),
        sender_id VARCHAR(100) NOT NULL,
        receiver_id VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        is_delivered BOOLEAN DEFAULT FALSE,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver ON chat_messages(receiver_id, is_read);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

      CREATE TABLE IF NOT EXISTS offline_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(100) NOT NULL,
        sender_id VARCHAR(100) NOT NULL,
        sender_name VARCHAR(150),
        sender_avatar VARCHAR(500),
        message_preview VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_offline_notifications_user ON offline_notifications(user_id, is_read);
    `);
    console.log("✅ chat_messages and offline_notifications tables verified / created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrateChatTables();
