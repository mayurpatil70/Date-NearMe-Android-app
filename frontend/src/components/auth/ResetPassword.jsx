import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axiosConfig";

const ResetPassword = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
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
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update password", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nearme-dark flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-nearme-card rounded-3xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md p-2 border border-gray-700 flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wide">
            New Password
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Secure your Date-NearMe account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={passwords.password}
              onChange={handleChange}
              className="w-full bg-nearme-dark border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-nearme-accent focus:ring-1 focus:ring-nearme-accent transition-colors"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full bg-nearme-dark border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-nearme-accent focus:ring-1 focus:ring-nearme-accent transition-colors"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-200 text-black font-semibold rounded-xl px-4 py-3.5 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mt-6 flex justify-center items-center"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
