require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

async function setAdminPassword() {
  const email = "noballondesk@gmail.com";
  const rawPassword = "Mayur@777";

  console.log(`Setting password for ${email}...`);

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);

  // Check if user exists
  const existing = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);

  let result;
  if (existing.rows.length > 0) {
    result = await pool.query(
      `UPDATE users 
       SET password_hash = $1,
           display_name = COALESCE(display_name, 'Admin Mayur'),
           phone_number = COALESCE(phone_number, '+91 96891 02662'),
           trust_score = 100,
           is_shield_verified = TRUE,
           is_work_verified = TRUE,
           updated_at = NOW()
       WHERE email = $2
       RETURNING id, email, display_name, phone_number, trust_score, is_shield_verified, updated_at`,
      [hash, email]
    );
    console.log("✅ Updated existing admin user:", result.rows[0]);
  } else {
    result = await pool.query(
      `INSERT INTO users (
         email, password_hash, display_name, phone_number,
         gender, wallet_balance, trust_score, is_shield_verified, is_work_verified,
         affiliate_code
       ) 
       VALUES ($1, $2, 'Admin Mayur', '+91 96891 02662', 'Male', 1000, 100, TRUE, TRUE, 'ADMIN_777')
       RETURNING id, email, display_name, phone_number, trust_score, is_shield_verified, created_at`,
      [email, hash]
    );
    console.log("✅ Created new admin user:", result.rows[0]);
  }

  // Verify that password comparison works 100%
  const verifyRow = await pool.query("SELECT password_hash FROM users WHERE email = $1", [email]);
  const isMatch = await bcrypt.compare(rawPassword, verifyRow.rows[0].password_hash);
  console.log("Password verification match test:", isMatch ? "MATCH (SUCCESS)" : "FAILED");

  await pool.end();
  process.exit(isMatch ? 0 : 1);
}

setAdminPassword().catch((err) => {
  console.error("Error setting admin password:", err);
  process.exit(1);
});
