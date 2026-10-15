const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        // Standard ₹50 = 50 Coins recharge
        const options = { amount: 50 * 100, currency: "INR", receipt: `rcpt_${userId}_${Date.now()}` };
        const order = await razorpay.orders.create(options);

        await Transaction.create({
            userId,
            razorpayOrderId: order.id,
            amount: 50,
            coinsGranted: 50
        });

        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id || req.user._id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id, status: 'pending' });
        if (!transaction) return res.status(400).json({ message: "Transaction not found or processed" });

        await Transaction.updateStatus(razorpay_order_id, 'success', razorpay_payment_id);

        const coinsToAdd = transaction.coins_granted || transaction.coinsGranted || 50;
        const updatedUser = await User.addWalletBalance(userId, coinsToAdd);

        res.json({ message: "Payment verified", newBalance: updatedUser.wallet_balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unlockLifetimeAccess = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);

        if (user.wallet_balance < 9) {
            return res.status(400).json({ message: "Insufficient coins. Recharge ₹50 required." });
        }

        const updatedUser = await User.addWalletBalance(userId, -9);
        await User.updateLifetimeAccess(userId, true);

        res.json({ message: "Lifetime access unlocked!", walletBalance: updatedUser.wallet_balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};