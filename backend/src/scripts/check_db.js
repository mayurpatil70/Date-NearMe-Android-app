require("dotenv").config();
const { pool } = require("../config/db");

async function checkDatabase() {
  console.log("--- Checking Database Connection & Schema ---");
  try {
    const tableRes = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
    );
    const tableNames = tableRes.rows.map((r) => r.table_name);
    console.log("Existing Tables:", tableNames);

    for (const table of tableNames) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`Table [${table}] row count: ${countRes.rows[0].count}`);
      } catch (err) {
        console.log(`Could not count table [${table}]:`, err.message);
      }
    }

    for (const table of tableNames) {
      const cols = await pool.query(
        "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position;",
        [table]
      );
      console.log(`\n=== Table [${table}] Columns ===`);
      console.table(cols.rows);
    }

    const userCount = await pool.query("SELECT COUNT(*) FROM users;");
    console.log("\nTotal Users in DB:", userCount.rows[0].count);

    const sampleUsers = await pool.query(
      "SELECT id, email, gender, wallet_balance, trust_score, created_at FROM users LIMIT 10;"
    );
    console.log("\nSample Users Data:");
    console.log(JSON.stringify(sampleUsers.rows, null, 2));

    await pool.end();
    console.log("\n--- Database Check Finished Successfully ---");
    process.exit(0);
  } catch (error) {
    console.error("Database connection/query error:", error);
    process.exit(1);
  }
}

checkDatabase();
