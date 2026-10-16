require("dotenv").config();
const { pool } = require("../config/db");

async function runMigration() {
  console.log("--- Running Database Schema Migration for Affiliate, Cafes & Safety ---");
  try {
    // 1. Add affiliate & Indian dating vitals to users table
    await pool.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS affiliate_code VARCHAR(50),
        ADD COLUMN IF NOT EXISTS referred_by VARCHAR(50),
        ADD COLUMN IF NOT EXISTS affiliate_balance NUMERIC DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100),
        ADD COLUMN IF NOT EXISTS diet VARCHAR(50) DEFAULT 'Pure Veg',
        ADD COLUMN IF NOT EXISTS relationship_intent VARCHAR(100) DEFAULT 'Dating for Marriage (1-2 Years)',
        ADD COLUMN IF NOT EXISTS family_dynamic VARCHAR(100) DEFAULT 'Planning to live independently',
        ADD COLUMN IF NOT EXISTS mother_tongue VARCHAR(50) DEFAULT 'Hindi',
        ADD COLUMN IF NOT EXISTS work_domain VARCHAR(100),
        ADD COLUMN IF NOT EXISTS is_shield_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS is_work_verified BOOLEAN DEFAULT FALSE;
    `);
    console.log("✅ Updated users table with affiliate, verification & cultural dealbreakers.");

    // 2. Ensure each existing user has a unique affiliate_code
    const users = await pool.query("SELECT id, email, affiliate_code FROM users WHERE affiliate_code IS NULL;");
    for (const u of users.rows) {
      const code = (u.email ? u.email.split("@")[0].toUpperCase().replace(/[^A-Z0-9]/g, "") : "USER") + "_" + Math.floor(1000 + Math.random() * 9000);
      await pool.query("UPDATE users SET affiliate_code = $1 WHERE id = $2;", [code, u.id]);
    }
    console.log(`✅ Generated affiliate codes for ${users.rows.length} existing users.`);

    // 3. Create cafe_partners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cafe_partners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address TEXT,
        discount_offer VARCHAR(255) DEFAULT '10% off bill for Date-NearMe couples',
        contact_phone VARCHAR(50),
        contact_email VARCHAR(255),
        qr_code_token VARCHAR(100) UNIQUE,
        commission_rate NUMERIC DEFAULT 10.0,
        total_couples_hosted INTEGER DEFAULT 0,
        total_revenue_recorded NUMERIC DEFAULT 0,
        commission_owed NUMERIC DEFAULT 0,
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Created/verified cafe_partners table.");

    // Seed top initial curated partner cafes if empty
    const cafeCount = await pool.query("SELECT COUNT(*) FROM cafe_partners;");
    if (parseInt(cafeCount.rows[0].count) === 0) {
      const sampleCafes = [
        {
          name: "Blue Tokai Coffee Roasters",
          city: "Bandra, Mumbai",
          address: "Perry Cross Rd, Bandra West",
          offer: "Free artisanal dessert on 1st date bill",
          qr: "CAFE_BLUETOKAI_MUM",
          phone: "+91 98200 11223",
          email: "bandra@bluetokai.com",
        },
        {
          name: "Third Wave Coffee",
          city: "Indiranagar, Bangalore",
          address: "12th Main Rd, HAL 2nd Stage",
          offer: "10% off bill + 2nd Pour-over Free",
          qr: "CAFE_THIRDWAVE_BLR",
          phone: "+91 98450 33445",
          email: "indiranagar@thirdwave.com",
        },
        {
          name: "Social (Hauz Khas)",
          city: "Hauz Khas Village, Delhi",
          address: "9A & 12, Hauz Khas Village",
          offer: "Priority Date Table + 15% off mocktails/beers",
          qr: "CAFE_SOCIAL_DELHI",
          phone: "+91 98110 55667",
          email: "hkv@socialoffline.in",
        },
      ];

      for (const c of sampleCafes) {
        await pool.query(
          `INSERT INTO cafe_partners (name, city, address, discount_offer, qr_code_token, contact_phone, contact_email)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [c.name, c.city, c.address, c.offer, c.qr, c.phone, c.email]
        );
      }
      console.log("✅ Seeded initial curated partner cafes.");
    }

    // 4. Create affiliate_conversions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS affiliate_conversions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        affiliate_code VARCHAR(50) NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        user_email VARCHAR(255),
        reward_amount NUMERIC DEFAULT 30,
        status VARCHAR(50) DEFAULT 'earned',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Created/verified affiliate_conversions table.");

    console.log("🎉 Migration completed successfully!");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
