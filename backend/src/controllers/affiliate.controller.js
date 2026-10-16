const { pool } = require("../config/db");

// Get current user's affiliate statistics and referral conversions
exports.getAffiliateStats = async (req, res) => {
  try {
    const user = req.user;

    // Fetch conversions from affiliate_conversions table
    const conversionsRes = await pool.query(
      `SELECT id, user_email, reward_amount, status, created_at 
       FROM affiliate_conversions 
       WHERE affiliate_code = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [user.affiliate_code]
    );

    res.json({
      affiliateCode: user.affiliate_code,
      affiliateBalance: Number(user.affiliate_balance || 0),
      totalReferrals: Number(user.total_referrals || 0),
      rewardPerJoin: 30, // 30 INR per user join
      upiId: user.upi_id || "",
      conversions: conversionsRes.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request withdrawal of affiliate earnings via UPI
exports.requestPayout = async (req, res) => {
  try {
    const { upiId } = req.body;
    const userId = req.user.id;

    if (!upiId || !upiId.includes("@")) {
      return res.status(400).json({ message: "Please provide a valid UPI ID (e.g. name@okhdfcbank)." });
    }

    const userRes = await pool.query("SELECT affiliate_balance FROM users WHERE id = $1", [userId]);
    const balance = Number(userRes.rows[0]?.affiliate_balance || 0);

    if (balance < 30) {
      return res.status(400).json({ message: "Minimum withdrawal balance is ₹30." });
    }

    // Save UPI ID and reset/deduct requested balance
    await pool.query(
      "UPDATE users SET upi_id = $1, affiliate_balance = 0 WHERE id = $2",
      [upiId, userId]
    );

    res.json({
      message: `Payout request of ₹${balance} submitted successfully to ${upiId}. Funds will be credited within 24 hours.`,
      amountWithdrawn: balance,
      upiId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
