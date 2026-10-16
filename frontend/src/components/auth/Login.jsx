"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      login(
        {
          id: data.id,
          email: data.email,
          phoneNumber: data.phoneNumber,
          displayName: data.displayName,
          gender: data.gender,
          affiliateCode: data.affiliateCode || data.affiliate_code,
          affiliateBalance: data.affiliateBalance || data.affiliate_balance || 0,
          diet: data.diet,
          relationshipIntent: data.relationshipIntent || data.relationship_intent,
          isShieldVerified: data.isShieldVerified || data.is_shield_verified,
          isAdmin: data.isAdmin,
          walletBalance: data.walletBalance,
          hasLifetimeAccess: data.hasLifetimeAccess,
        },
        data.token,
      );
      toast.success("Successfully logged in!");
      router.push("/radar");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailToReset = prompt(
      "Enter your registered email to reset your password:",
    );
    if (!emailToReset) return;
    const toastId = toast.loading("Sending reset link...");
    try {
      const { data } = await api.post("/auth/forgot-password", { email: emailToReset });
      toast.success(data.message || `Password reset link sent to ${emailToReset}`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-stone-900 relative overflow-hidden selection:bg-[#711A31] selection:text-white">
      {/* Ambient warm glossy glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-200/35 via-amber-100/30 to-pink-200/35 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.03)] p-8 sm:p-10 border border-stone-200/80 z-10 relative">
        {/* Top gloss specular highlight */}
        <div className="absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-stone-200 to-transparent pointer-events-none"></div>

        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-md p-2.5 border border-stone-100 flex items-center justify-center mb-3 hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Welcome to Date-NearMe
          </h2>
          <p className="text-stone-500 text-xs font-medium mt-1">
            "The intentional dating app designed to be deleted."
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#711A31] hover:text-[#541223] font-bold transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#711A31] hover:bg-[#541223] text-white font-black rounded-2xl px-4 py-3.5 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 mt-6 flex justify-center items-center shadow-lg shadow-[#711A31]/25 text-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-stone-500 mt-6 text-xs font-medium">
          New to Date-NearMe?{" "}
          <Link
            href="/register"
            className="text-[#711A31] hover:underline font-bold transition-colors ml-1"
          >
            Create an account (₹199 Lifetime)
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
