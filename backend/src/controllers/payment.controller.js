const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/user");


exports.createOrder = async (req, res) => {
  try {
    const { amount = 199, type = "registration" } = req.body; // Default 199 INR lifetime membership

    // Razorpay expects the amount in paise (multiply INR by 100)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Razorpay order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type = "registration",
      userId,
      referredBy,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Handle PostgreSQL database updates
    if (type === "registration") {
      await User.updateLifetimeAccess(userId, true);

      // Record transaction
      try {
        const { pool } = require("../config/db");
        await pool.query(
          `INSERT INTO transactions (user_id, razorpay_order_id, razorpay_payment_id, amount, coins_granted, status)
           VALUES ($1, $2, $3, $4, $5, 'success')
           ON CONFLICT (razorpay_order_id) DO NOTHING`,
          [userId, razorpay_order_id, razorpay_payment_id, 199, 1000]
        );

        // If user was referred by affiliate, process reward
        if (referredBy) {
          await User.processAffiliateReward(referredBy, userId, null, 30);
        }
      } catch (txErr) {
        console.error("Transaction logging non-blocking error:", txErr.message);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};
