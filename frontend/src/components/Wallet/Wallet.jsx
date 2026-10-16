import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Wallet = () => {
  const { user, updateWallet } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin =
    user?.email?.toLowerCase() === "noballondesk@gmail.com" || user?.isAdmin;

  const handleRecharge = async () => {
    // ADMIN TEST BYPASS: Add 100 coins immediately without Razorpay
    if (isAdmin) {
      const newBal = (user?.walletBalance || 0) + 100;
      updateWallet(newBal);
      toast.success("⚡ Admin Pass: Added 100 coins instantly!");
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: order } = await api.post("/wallet/create-order");

      // 2. Open Razorpay Checkout
      const razorpayKey =
        process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_Tfq9kcJ78djyjL";

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Date-NearMe",
        description: "50 Coins Recharge",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await api.post("/wallet/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Recharge successful!");
            updateWallet(verifyRes.data.newBalance);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#ff2453" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Could not initiate payment");
    }
  };

  const handleUnlockLifetime = async () => {
    try {
      const res = await api.post("/wallet/unlock-lifetime");
      toast.success(res.data.message);
      updateWallet(res.data.walletBalance);
      // Reload window to update global 'hasLifetimeAccess' state
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unlock");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
        <button
          onClick={() => navigate("/radar")}
          className="absolute top-6 left-6 text-sm font-semibold text-gray-500 hover:text-black flex items-center transition"
        >
          ← Back
        </button>

        {/* Brand Header */}
        <div className="text-center mt-6 mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md p-2 border border-gray-100 flex items-center justify-center mb-3">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Your Wallet
          </h2>
          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
            {user?.hasLifetimeAccess ? "★ Lifetime Member" : "Standard Account"}
          </span>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-tr from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-6 text-center mb-6">
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-600 block mb-1">
            Current Balance
          </span>
          <div className="text-4xl font-black text-gray-900 flex items-center justify-center">
            <span className="mr-2">🪙</span> {user?.walletBalance || 0}
            <span className="text-base font-semibold text-gray-500 ml-2">Coins</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRecharge}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold rounded-xl py-3.5 px-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-md flex justify-center items-center"
          >
            Recharge 50 Coins (₹50)
          </button>

          {!user?.hasLifetimeAccess && (
            <button
              onClick={handleUnlockLifetime}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-xl py-3.5 px-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-md flex justify-center items-center"
            >
              Unlock Lifetime Access (9 Coins)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
