"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gender: "Male",
    phoneNumber: "",
    displayName: "",
    referredBy: "",
    diet: "Pure Veg",
    relationshipIntent: "Dating for Marriage (1-2 Years)",
    familyDynamic: "Planning to live independently",
    motherTongue: "Hindi",
  });
  const [loading, setLoading] = useState(false);

  // Check URL query parameters for referral code (from Cafe Standee QR or Affiliate Link)
  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) {
      setFormData((prev) => ({ ...prev, referredBy: ref.trim().toUpperCase() }));
      toast.success(`Partner QR Applied: ${ref.trim().toUpperCase()} ✨`, {
        icon: "☕",
      });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isAdmin =
    formData.email.trim().toLowerCase() === "noballondesk@gmail.com";

  const handlePaymentAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ADMIN BYPASS: Bypass Razorpay completely for noballondesk@gmail.com
    if (isAdmin) {
      try {
        const { data } = await api.post("/auth/register", formData);
        login(
          {
            ...data,
            walletBalance: 500,
            hasLifetimeAccess: true,
            isAdmin: true,
          },
          data.token,
        );
        toast.success("Admin access granted! Welcome, Master Tester.", {
          duration: 4000,
        });
        router.push("/radar");
        return;
      } catch (err) {
        try {
          const { data } = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password,
          });
          login(
            {
              ...data,
              walletBalance: 500,
              hasLifetimeAccess: true,
              isAdmin: true,
            },
            data.token,
          );
          toast.success("Admin logged in successfully!");
          router.push("/radar");
          return;
        } catch (loginErr) {
          toast.error(err.response?.data?.message || "Admin setup failed");
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    try {
      // 1. Create order for ₹199 Lifetime Access
      const { data: orderData } = await api.post("/payments/create-order", {
        amount: 199,
        type: "registration",
      });

      if (!orderData.success) throw new Error("Failed to initiate payment");

      // 2. Open Razorpay Checkout for ₹199
      const razorpayKey =
        process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_Tfq9kcJ78djyjL";

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Date-NearMe",
        description: "₹199 Lifetime Membership & Unlimited Chats",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: "registration",
              referredBy: formData.referredBy,
            });

            // Register user in database
            const { data } = await api.post("/auth/register", formData);
            login(data, data.token);
            toast.success("Payment verified! Welcome to Date-NearMe Lifetime.");
            router.push("/radar");
          } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
            router.push("/login");
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#711a31" },
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
            setLoading(false);
            toast("Payment window closed", { icon: "ℹ️" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment initiation failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-stone-900 relative overflow-hidden selection:bg-[#711A31] selection:text-white">
      {/* Ambient warm glossy glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-200/35 via-amber-100/30 to-pink-200/35 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.03)] p-7 sm:p-9 border border-stone-200/80 z-10 relative">
        {/* Top gloss specular highlight */}
        <div className="absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-stone-200 to-transparent pointer-events-none"></div>

        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md p-2 border border-stone-100 flex items-center justify-center mb-2 hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Join Date-NearMe
          </h2>
          {isAdmin ? (
            <p className="text-emerald-700 font-bold mt-1 text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ Admin Mode: Free Pass Activated
            </p>
          ) : (
            <p className="text-stone-500 font-medium mt-1 text-xs">
              Unlock <span className="text-[#711A31] font-bold">Lifetime Access</span> for ₹199 (No recharges needed!)
            </p>
          )}

          {formData.referredBy && (
            <div className="mt-2 text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
              <span>☕ Cafe / Partner Code:</span>
              <span className="font-mono text-stone-900 font-bold">{formData.referredBy}</span>
            </div>
          )}
        </div>

        <form onSubmit={handlePaymentAndRegister} className="space-y-3.5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="displayName"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="e.g. Ananya Sen"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Mobile Number with Placeholder */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Mobile Number
              </label>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Stored securely
              </span>
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400 font-mono"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="••••••••"
            />
          </div>

          {/* Cultural & Lifestyle Dealbreakers (Diet, Intent, Gender) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#711A31]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Dietary Habit
              </label>
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#711A31]"
              >
                <option value="Pure Veg">Pure Veg 🥗</option>
                <option value="Jain">Strict Jain 🪷</option>
                <option value="Eggetarian">Eggetarian 🥚</option>
                <option value="Non-Veg">Non-Veg 🍗</option>
                <option value="Vegan">Vegan 🌱</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Relationship Goal (No Situationships)
            </label>
            <select
              name="relationshipIntent"
              value={formData.relationshipIntent}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#711A31]"
            >
              <option value="Dating for Marriage (1-2 Years)">
                💍 Dating for Marriage (1-2 Years)
              </option>
              <option value="Serious Long-Term Relationship">
                💫 Serious Long-Term Relationship
              </option>
              <option value="Dating with Intent to Settle">
                ☕ Dating with Intent to Settle
              </option>
              <option value="Open to seeing where it leads">
                🌱 Open to seeing where it leads
              </option>
            </select>
          </div>

          {/* Referral / Partner QR Code input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Partner Cafe / Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3.5 py-2 text-xs font-mono uppercase focus:outline-none focus:bg-white focus:border-[#711A31] placeholder-stone-400"
              placeholder="e.g. CAFE_BLUETOKAI or FRIEND_CODE"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-black rounded-2xl px-4 py-3.5 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 mt-4 flex justify-center items-center shadow-lg text-sm ${
              isAdmin
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "bg-[#711A31] hover:bg-[#541223] text-white shadow-[#711A31]/25"
            }`}
          >
            {loading
              ? "Connecting..."
              : isAdmin
                ? "⚡ Enter Free as Admin"
                : "Pay ₹199 & Unlock Lifetime Access"}
          </button>
        </form>

        <p className="text-center text-stone-500 mt-5 text-xs font-medium">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-[#711A31] hover:underline font-bold transition-colors ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
