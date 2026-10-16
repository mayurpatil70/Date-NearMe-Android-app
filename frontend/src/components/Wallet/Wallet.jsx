"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Wallet = () => {
  const { user, updateWallet } = useContext(AuthContext);
  const router = useRouter();

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
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI Apps",
                instruments: [
                  {
                    method: "upi",
                    flows: ["intent", "qr"],
                    apps: ["google_pay", "phonepe", "paytm", "bhim"],
                  },
                ],
              },
              other: {
                name: "Cards, Netbanking & Wallets",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: function () {
            toast("Payment window closed", { icon: "ℹ️" });
          },
        },
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
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-stone-900 relative overflow-hidden selection:bg-[#711A31] selection:text-white">
      {/* Ambient warm glossy glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-200/35 via-amber-100/30 to-pink-200/35 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.03)] p-8 sm:p-10 border border-stone-200/80 relative z-10">
        {/* Top gloss specular highlight */}
        <div className="absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-stone-200 to-transparent pointer-events-none"></div>

        <button
          onClick={() => router.push("/radar")}
          className="absolute top-7 left-7 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 flex items-center transition px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
        >
          ← Back
        </button>

        {/* Brand Header */}
        <div className="text-center mt-6 mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-md p-2.5 border border-stone-100 flex items-center justify-center mb-3">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
            Your Wallet
          </h2>
          <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-[#711A31] text-xs font-bold rounded-full border border-rose-200">
            {user?.hasLifetimeAccess ? "👑 Lifetime Member" : "Standard Account"}
          </span>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-tr from-rose-50 to-amber-50/60 border border-rose-100 rounded-3xl p-6 text-center mb-6 shadow-sm">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#711A31] block mb-1">
            Current Balance
          </span>
          <div className="text-4xl font-serif font-black text-stone-900 flex items-center justify-center">
            <span className="mr-2">🪙</span> {user?.walletBalance || 0}
            <span className="text-base font-sans font-semibold text-stone-500 ml-2">Coins</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRecharge}
            className="w-full bg-[#711A31] hover:bg-[#541223] text-white font-black rounded-2xl py-3.5 px-4 transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-[#711A31]/25 flex justify-center items-center text-sm"
          >
            Recharge 50 Coins (₹50)
          </button>

          {!user?.hasLifetimeAccess && (
            <button
              onClick={handleUnlockLifetime}
              className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-90 text-white font-bold rounded-2xl py-3.5 px-4 transition-all transform hover:scale-[1.01] active:scale-95 shadow-md flex justify-center items-center text-sm"
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
