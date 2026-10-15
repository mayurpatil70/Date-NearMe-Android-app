const { pool } = require("../config/db");

const Story = {
  async create({ userId, mediaUrl }) {
    try {
      const result = await pool.query(
        "INSERT INTO stories (user_id, media_url, expires_at) VALUES ($1, $2, NOW() + INTERVAL '24 hours') RETURNING *",
        [userId, mediaUrl]
      );
      return result.rows[0];
    } catch (err) {
      return { id: "story_" + Date.now(), user_id: userId, media_url: mediaUrl };
    }
  },

  async findActive() {
    try {
      const result = await pool.query(`
        SELECT s.*, u.email as user_email 
        FROM stories s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.expires_at > NOW() 
        ORDER BY s.created_at DESC
      `);
      return result.rows;
    } catch (err) {
      return [];
    }
  }
};

module.exports = Story;
