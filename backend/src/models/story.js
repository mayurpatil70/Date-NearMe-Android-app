const { pool } = require("../config/db");

const ensureStoriesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        media_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
      );
    `);
  } catch (err) {
    console.error("ensureStoriesTable error:", err.message);
  }
};

ensureStoriesTable();

const Story = {
  async create({ userId, mediaUrl }) {
    try {
      await ensureStoriesTable();
      const result = await pool.query(
        "INSERT INTO stories (user_id, media_url, expires_at) VALUES ($1, $2, NOW() + INTERVAL '24 hours') RETURNING *",
        [userId, mediaUrl]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Story.create error:", err.message);
      return {
        id: "story_" + Date.now(),
        user_id: userId,
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
      };
    }
  },

  async findActive() {
    try {
      await ensureStoriesTable();
      const result = await pool.query(`
        SELECT 
          s.id,
          s.user_id,
          s.media_url,
          s.created_at,
          s.expires_at,
          COALESCE(u.display_name, split_part(u.email, '@', 1), 'Member') as user_name,
          u.email as user_email
        FROM stories s 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.expires_at > NOW() 
        ORDER BY s.created_at DESC
      `);
      return result.rows;
    } catch (err) {
      console.error("Story.findActive error:", err.message);
      return [];
    }
  },
};

module.exports = Story;
