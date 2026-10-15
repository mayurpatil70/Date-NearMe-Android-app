require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.NEON_DATABASE_URL || process.env.NEON_DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  console.log("Connecting to Neon PostgreSQL...");

  // 1. Add missing auth columns to users table
  await pool.query(`
    ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'Male',
      ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_password_expire TIMESTAMP WITH TIME ZONE;
  `);
  console.log("Added email, password_hash, gender columns to users table.");

  // 2. Drop NOT NULL constraint on firebase_uid if it exists
  await pool.query(`
    ALTER TABLE users ALTER COLUMN firebase_uid DROP NOT NULL;
  `);
  console.log("Dropped NOT NULL on firebase_uid.");

  // 3. Create transactions table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
      razorpay_payment_id VARCHAR(255),
      amount INTEGER NOT NULL,
      coins_granted INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log("Verified transactions table.");

  // 4. Verify columns
  const res = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'users';"
  );
  console.log("Current users columns:", res.rows.map((r) => r.column_name));

  await pool.end();
  console.log("Migration completed successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
