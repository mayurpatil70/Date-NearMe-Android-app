const Razorpay = require('razorpay');

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn("Razorpay initialization error:", err.message);
  }
} else {
  console.warn("Razorpay warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured.");
}

// Fallback dummy object so calls fail gracefully at runtime instead of crashing the server on boot
if (!razorpayInstance) {
  razorpayInstance = {
    orders: {
      create: async () => {
        throw new Error("Razorpay credentials are not configured on the server.");
      },
    },
    payments: {
      fetch: async () => {
        throw new Error("Razorpay credentials are not configured on the server.");
      },
    },
  };
}

module.exports = razorpayInstance;