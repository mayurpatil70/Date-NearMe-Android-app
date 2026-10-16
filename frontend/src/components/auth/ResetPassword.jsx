"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "../../api/axiosConfig";

const ResetPassword = () => {
  const params = useParams();
  const token = params?.token;
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, {
        password: passwords.password,
      });

      toast.success(data.message || "Password updated successfully! You can now log in.", {
        id: toastId,
      });
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update password", {
        id: toastId,
      });
    } finally {
      setLoading(false);
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
          <div className="w-20 h-20 rounded-3xl bg-white shadow-md p-2.5 border border-stone-100 flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
            New Password
          </h2>
          <p className="text-stone-500 mt-1 text-xs">
            Secure your Date-NearMe account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={passwords.password}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#711A31] focus:ring-2 focus:ring-[#711A31]/15 transition placeholder-stone-400"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#711A31] hover:bg-[#541223] text-white font-black rounded-2xl px-4 py-3.5 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 mt-6 flex justify-center items-center shadow-lg shadow-[#711A31]/25 text-sm"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
