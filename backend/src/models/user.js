const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  // Find a user by email
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  // Create a new user with affiliate code and referral tracking
  async create({
    email,
    password,
    gender,
    phoneNumber,
    displayName,
    referredBy,
    diet,
    relationshipIntent,
    familyDynamic,
    motherTongue,
  }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate random unique affiliate code e.g. RAHUL_8921
    const prefix = (displayName || email || "USER")
      .split("@")[0]
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6) || "USER";
    const affiliateCode = `${prefix}_${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, gender, phone_number, display_name,
        affiliate_code, referred_by, diet, relationship_intent,
        family_dynamic, mother_tongue
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING 
        id, email, phone_number, display_name, gender, wallet_balance,
        trust_score, affiliate_code, referred_by, affiliate_balance,
        total_referrals, upi_id, diet, relationship_intent, family_dynamic,
        mother_tongue, is_shield_verified, is_work_verified, created_at`,
      [
        email,
        hashedPassword,
        gender || "Male",
        phoneNumber || null,
        displayName || null,
        affiliateCode,
        referredBy || null,
        diet || "Pure Veg",
        relationshipIntent || "Dating for Marriage (1-2 Years)",
        familyDynamic || "Planning to live independently",
        motherTongue || "Hindi",
      ]
    );

    const user = result.rows[0];

    // If referred by a valid affiliate or cafe QR code, reward referrer 30 INR
    if (referredBy && user) {
      await User.processAffiliateReward(referredBy, user.id, user.email, 30);
    }

    if (user) {
      user.phoneNumber = user.phone_number;
      user.displayName = user.display_name;
      user.walletBalance = user.wallet_balance;
      user.affiliateCode = user.affiliate_code;
      user.affiliateBalance = user.affiliate_balance;
      user.totalReferrals = user.total_referrals;
      user.relationshipIntent = user.relationship_intent;
      user.familyDynamic = user.family_dynamic;
      user.motherTongue = user.mother_tongue;
      user.isShieldVerified = user.is_shield_verified;
      user.isWorkVerified = user.is_work_verified;
    }
    return user;
  },

  // Process affiliate reward for referrer user or partner cafe
  async processAffiliateReward(code, newUserId, newUserEmail, rewardAmount = 30) {
    try {
      // 1. Check if code belongs to a user
      const userRef = await pool.query(
        "SELECT id FROM users WHERE affiliate_code = $1",
        [code]
      );
      if (userRef.rows.length > 0) {
        await pool.query(
          "UPDATE users SET affiliate_balance = affiliate_balance + $1, total_referrals = total_referrals + 1 WHERE id = $2",
          [rewardAmount, userRef.rows[0].id]
        );
      } else {
        // 2. Check if code belongs to a cafe partner QR
        await pool.query(
          "UPDATE cafe_partners SET total_couples_hosted = total_couples_hosted + 1 WHERE qr_code_token = $1",
          [code]
        );
      }

      // 3. Log in affiliate conversions
      await pool.query(
        `INSERT INTO affiliate_conversions (affiliate_code, user_id, user_email, reward_amount)
         VALUES ($1, $2, $3, $4)`,
        [code, newUserId, newUserEmail, rewardAmount]
      );
    } catch (err) {
      console.error("Affiliate processing non-blocking error:", err.message);
    }
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

  // Find a user by ID
  async findById(id) {
    const result = await pool.query(
      `SELECT 
        id, email, phone_number, display_name, gender, wallet_balance, trust_score,
        affiliate_code, referred_by, affiliate_balance, total_referrals, upi_id,
        diet, relationship_intent, family_dynamic, mother_tongue, work_domain,
        is_shield_verified, is_work_verified, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    if (!result.rows[0]) return null;
    const user = result.rows[0];
    user.walletBalance = user.wallet_balance;
    user.phoneNumber = user.phone_number;
    user.displayName = user.display_name;
    user.affiliateCode = user.affiliate_code;
    user.affiliateBalance = user.affiliate_balance;
    user.totalReferrals = user.total_referrals;
    user.relationshipIntent = user.relationship_intent;
    user.familyDynamic = user.family_dynamic;
    user.motherTongue = user.mother_tongue;
    user.isShieldVerified = user.is_shield_verified;
    user.isWorkVerified = user.is_work_verified;
    user.upiId = user.upi_id;
    user._id = user.id;
    return user;
  },

  // Update user profile (mobile number, display name, gender, diet, intent, verifications)
  async updateProfile(id, fields) {
    const {
      phoneNumber,
      displayName,
      gender,
      diet,
      relationshipIntent,
      familyDynamic,
      motherTongue,
      workDomain,
      isShieldVerified,
      isWorkVerified,
      upiId,
    } = fields;

    const result = await pool.query(
      `UPDATE users 
       SET phone_number = COALESCE($1, phone_number),
           display_name = COALESCE($2, display_name),
           gender = COALESCE($3, gender),
           diet = COALESCE($4, diet),
           relationship_intent = COALESCE($5, relationship_intent),
           family_dynamic = COALESCE($6, family_dynamic),
           mother_tongue = COALESCE($7, mother_tongue),
           work_domain = COALESCE($8, work_domain),
           is_shield_verified = COALESCE($9, is_shield_verified),
           is_work_verified = COALESCE($10, is_work_verified),
           upi_id = COALESCE($11, upi_id),
           updated_at = NOW()
       WHERE id = $12 
       RETURNING 
         id, email, phone_number, display_name, gender, wallet_balance, trust_score,
         affiliate_code, referred_by, affiliate_balance, total_referrals, upi_id,
         diet, relationship_intent, family_dynamic, mother_tongue, work_domain,
         is_shield_verified, is_work_verified, updated_at`,
      [
        phoneNumber || null,
        displayName || null,
        gender || null,
        diet || null,
        relationshipIntent || null,
        familyDynamic || null,
        motherTongue || null,
        workDomain || null,
        isShieldVerified !== undefined ? isShieldVerified : null,
        isWorkVerified !== undefined ? isWorkVerified : null,
        upiId || null,
        id,
      ]
    );

    if (!result.rows[0]) return null;
    const user = result.rows[0];
    user.walletBalance = user.wallet_balance;
    user.phoneNumber = user.phone_number;
    user.displayName = user.display_name;
    user.affiliateCode = user.affiliate_code;
    user.affiliateBalance = user.affiliate_balance;
    user.totalReferrals = user.total_referrals;
    user.relationshipIntent = user.relationship_intent;
    user.familyDynamic = user.family_dynamic;
    user.motherTongue = user.mother_tongue;
    user.isShieldVerified = user.is_shield_verified;
    user.isWorkVerified = user.is_work_verified;
    user.upiId = user.upi_id;
    return user;
  },

  // Update wallet balance
  async addWalletBalance(userId, amount) {
    const result = await pool.query(
      "UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING id, wallet_balance",
      [amount, userId]
    );
    return result.rows[0];
  },

  // Update lifetime access
  async updateLifetimeAccess(userId, hasAccess = true) {
    const result = await pool.query(
      "UPDATE users SET trust_score = trust_score + 10 WHERE id = $1 RETURNING id",
      [userId]
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
  },
};

module.exports = User;
