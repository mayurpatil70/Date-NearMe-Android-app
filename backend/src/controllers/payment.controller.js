const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, type } = req.body; // type can be 'registration' (9 INR) or 'recharge' (50 INR)

    // Razorpay expects the amount in paise (multiply INR by 100)
    const options = {
      amount: amount * 100,
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
      type,
      userId,
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

    // Handle PostgreSQL database updates based on the payment type
    if (type === "registration") {
      await User.updateLifetimeAccess(userId, true);
    } else if (type === "recharge") {
      await User.addWalletBalance(userId, 50);
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
