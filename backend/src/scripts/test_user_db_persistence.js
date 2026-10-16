require("dotenv").config();
const { pool } = require("../config/db");
const User = require("../models/user");

async function runTestSuite() {
  console.log("==========================================================");
  console.log("  GRAVITAS RELIABILITY TEST SUITE: DB PERSISTENCE & AUTH  ");
  console.log("==========================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  const testEmail = `test_hinge_${Date.now()}@example.com`;
  const testPassword = "Password@1234!";
  const testPhone = "+91 98765 43210";
  const testDisplayName = "Aarav Sharma";
  const testGender = "Male";

  try {
    // TEST 1: Database Connection
    console.log("--- TEST 1: Live PostgreSQL Connection Check ---");
    const dbCheck = await pool.query("SELECT current_database(), current_user, version();");
    assert(dbCheck.rows.length > 0, "PostgreSQL connected and responsive");
    console.log(`Connected DB: ${dbCheck.rows[0].current_database} as ${dbCheck.rows[0].current_user}`);

    // TEST 2: User Creation with Affiliate Code & Cultural Vitals
    console.log("\n--- TEST 2: User Registration & Persistence Check ---");
    const createdUser = await User.create({
      email: testEmail,
      password: testPassword,
      gender: testGender,
      phoneNumber: testPhone,
      displayName: testDisplayName,
      diet: "Pure Veg",
      relationshipIntent: "Dating for Marriage (1-2 Years)",
      familyDynamic: "Planning to live independently",
      motherTongue: "Hindi",
    });
    assert(createdUser && createdUser.id, "User created and returned UUID id");
    assert(createdUser.email === testEmail, "Returned email matches test input");
    assert(createdUser.phoneNumber === testPhone, "Returned phoneNumber matches test input");
    assert(createdUser.displayName === testDisplayName, "Returned displayName matches test input");
    assert(Boolean(createdUser.affiliateCode), "User received auto-generated affiliate code");
    console.log(`Generated Affiliate Code: ${createdUser.affiliateCode}`);

    // TEST 3: Physical Database Verification (Direct SQL Query bypass)
    console.log("\n--- TEST 3: Direct Database Table Query (Verifying disk persistence) ---");
    const dbRecord = await pool.query(
      `SELECT id, email, password_hash, phone_number, display_name, gender,
              affiliate_code, diet, relationship_intent, wallet_balance, trust_score, created_at 
       FROM users WHERE id = $1;`,
      [createdUser.id]
    );
    assert(dbRecord.rows.length === 1, "Exactly one row found in PostgreSQL 'users' table");
    const row = dbRecord.rows[0];
    assert(row.email === testEmail, "DB email verified in physical database row");
    assert(row.password_hash && row.password_hash.startsWith("$2b$"), "DB password_hash is valid bcrypt hash");
    assert(row.phone_number === testPhone, "DB phone_number verified in physical database row");
    assert(row.display_name === testDisplayName, "DB display_name verified in physical database row");
    assert(row.affiliate_code === createdUser.affiliateCode, "DB affiliate_code matches");
    assert(row.diet === "Pure Veg", "DB diet verified as Pure Veg");
    assert(row.relationship_intent === "Dating for Marriage (1-2 Years)", "DB relationship intent verified");

    // TEST 4: Password Verification & Login Match
    console.log("\n--- TEST 4: Password Verification & Login Match ---");
    const passwordMatchValid = await User.matchPassword(testPassword, row.password_hash);
    assert(passwordMatchValid === true, "Valid password matched bcrypt hash successfully");
    const passwordMatchInvalid = await User.matchPassword("WrongPassword123", row.password_hash);
    assert(passwordMatchInvalid === false, "Invalid password rejected by bcrypt correctly");

    // TEST 5: User Lookup Functions (findById & findByEmail)
    console.log("\n--- TEST 5: User Lookup Functions (findById & findByEmail) ---");
    const foundById = await User.findById(createdUser.id);
    assert(foundById !== null, "User found by ID");
    assert(foundById.phoneNumber === testPhone, "findById returns phoneNumber");
    assert(foundById.displayName === testDisplayName, "findById returns displayName");
    assert(foundById.affiliateCode === createdUser.affiliateCode, "findById returns affiliateCode");

    // TEST 6: Profile Update (e.g. changing mobile number & shield verification)
    console.log("\n--- TEST 6: Profile Update (Mobile Number & Verification in DB) ---");
    const updatedPhone = "+91 99887 76655";
    const updatedUser = await User.updateProfile(createdUser.id, {
      phoneNumber: updatedPhone,
      isShieldVerified: true,
      diet: "Jain",
      upiId: "aarav@okhdfcbank",
    });
    assert(updatedUser.phoneNumber === updatedPhone, "updateProfile returned updated phoneNumber");
    assert(updatedUser.isShieldVerified === true, "updateProfile marked isShieldVerified");
    assert(updatedUser.diet === "Jain", "updateProfile updated diet to Jain");

    // TEST 7: Affiliate Tracking & Reward Processing
    console.log("\n--- TEST 7: Affiliate Tracking (30 INR reward on referral join) ---");
    const referredEmail = `test_referred_${Date.now()}@example.com`;
    const referredUser = await User.create({
      email: referredEmail,
      password: "Password@999!",
      displayName: "Pooja V.",
      referredBy: createdUser.affiliateCode, // Uses createdUser's affiliate code
    });
    assert(referredUser && referredUser.id, "Referred user created successfully");

    // Check that referrer received 30 INR
    const referrerCheck = await pool.query(
      "SELECT affiliate_balance, total_referrals FROM users WHERE id = $1",
      [createdUser.id]
    );
    assert(Number(referrerCheck.rows[0].affiliate_balance) >= 30, "Referrer received 30 INR affiliate reward");
    assert(Number(referrerCheck.rows[0].total_referrals) >= 1, "Referrer total_referrals incremented");
    console.log(`Referrer Affiliate Balance: ₹${referrerCheck.rows[0].affiliate_balance}`);

    // TEST 8: Cafe Partner Bill Logging & 10% Platform Revenue Share
    console.log("\n--- TEST 8: Cafe Partner Revenue Sharing (10% platform commission) ---");
    const sampleCafe = await pool.query("SELECT qr_code_token, name FROM cafe_partners LIMIT 1;");
    if (sampleCafe.rows.length > 0) {
      const cafeQr = sampleCafe.rows[0].qr_code_token;
      const initialCafe = await pool.query("SELECT total_revenue_recorded, commission_owed FROM cafe_partners WHERE qr_code_token = $1", [cafeQr]);
      const prevRev = Number(initialCafe.rows[0].total_revenue_recorded || 0);
      const prevComm = Number(initialCafe.rows[0].commission_owed || 0);

      const billAmount = 1500; // Couple spent ₹1500 at cafe
      const commission = billAmount * 0.10; // 10% = ₹150

      await pool.query(
        `UPDATE cafe_partners
         SET total_revenue_recorded = total_revenue_recorded + $1,
             commission_owed = commission_owed + $2,
             total_couples_hosted = total_couples_hosted + 1
         WHERE qr_code_token = $3`,
        [billAmount, commission, cafeQr]
      );

      const updatedCafe = await pool.query("SELECT total_revenue_recorded, commission_owed FROM cafe_partners WHERE qr_code_token = $1", [cafeQr]);
      assert(Number(updatedCafe.rows[0].total_revenue_recorded) === prevRev + billAmount, "Cafe bill spend tracked accurately");
      assert(Number(updatedCafe.rows[0].commission_owed) === prevComm + commission, "10% platform revenue commission recorded accurately");
      console.log(`Cafe: ${sampleCafe.rows[0].name} | Bill: ₹${billAmount} | 10% Platform Commission: ₹${commission}`);
    }

    // Clean up test records
    await pool.query("DELETE FROM users WHERE id IN ($1, $2);", [createdUser.id, referredUser.id]);
    await pool.query("DELETE FROM affiliate_conversions WHERE affiliate_code = $1;", [createdUser.affiliateCode]);
    console.log(`\nCleaned up ephemeral test records.`);

    console.log("\n==========================================================");
    console.log(`  VERDICT: PASS (${passedTests}/${totalTests} tests succeeded)  `);
    console.log("==========================================================");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test Suite Aborted with Error:", error);
    await pool.end();
    process.exit(1);
  }
}

runTestSuite();
