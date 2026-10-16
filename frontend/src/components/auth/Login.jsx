import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
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
      navigate("/radar");
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
    <div className="min-h-screen bg-radial from-[#1e1528] via-[#100e17] to-[#07060a] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#711a31]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/[0.08] backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/[0.15] z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 flex items-center justify-center mb-3 shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black tracking-tight text-white">
            Welcome to Date-NearMe
          </h2>
          <p className="text-stone-300 text-xs font-medium mt-1">
            "The intentional dating app designed to be deleted."
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase text-stone-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
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
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#711a31] via-rose-600 to-amber-600 hover:opacity-90 text-white font-black rounded-xl px-4 py-3.5 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-6 flex justify-center items-center shadow-xl text-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-stone-400 mt-6 text-xs font-medium">
          New to Date-NearMe?{" "}
          <Link
            to="/register"
            className="text-rose-400 hover:underline font-bold transition-colors ml-1"
          >
            Create an account (₹199 Lifetime)
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
