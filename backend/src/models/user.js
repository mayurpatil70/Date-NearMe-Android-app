const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  // Find a user by email
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  // Create a new user
  async create({ email, password, gender }) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // In a real app we might also need to generate a unique firebase_uid if we used Firebase,
    // but since we are using Custom DB Auth, we just use UUID for id.
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, gender) 
       VALUES ($1, $2, $3) RETURNING id, email, gender, wallet_balance, trust_score`,
      [email, hashedPassword, gender || 'Male']
    );
    return result.rows[0];
  },

  // Compare passwords
  async matchPassword(enteredPassword, userPasswordHash) {
    return await bcrypt.compare(enteredPassword, userPasswordHash);
  },

  // Set password reset token
  async setResetToken(email, token, expireDate) {
    const result = await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE email = $3 RETURNING *",
      [token, expireDate, email]
    );
    return result.rows[0];
  },

  // Find user by valid reset token
  async findByValidResetToken(token) {
    const result = await pool.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
      [token]
    );
    return result.rows[0];
  },

  // Update password and clear tokens
  async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_password_token = NULL, reset_password_expire = NULL 
       WHERE id = $2 RETURNING id, email`,
      [hashedPassword, userId]
    );
    return result.rows[0];
  }
};

module.exports = User;
