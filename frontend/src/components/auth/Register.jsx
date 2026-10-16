import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setFormData((prev) => ({ ...prev, referredBy: ref.trim().toUpperCase() }));
      toast.success(`Partner QR Applied: ${ref.trim().toUpperCase()} ✨`, {
        icon: "☕",
      });
    }
  }, [location.search]);

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
        navigate("/radar");
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
          navigate("/radar");
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
            navigate("/radar");
          } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
            navigate("/login");
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#711a31" },
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
    <div className="min-h-screen bg-radial from-[#1e1528] via-[#100e17] to-[#07060a] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#711a31]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/[0.08] backdrop-blur-2xl rounded-3xl shadow-2xl p-7 border border-white/[0.15] z-10">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 flex items-center justify-center mb-2 shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-serif font-black tracking-tight text-white">
            Join Date-NearMe
          </h2>
          {isAdmin ? (
            <p className="text-emerald-400 font-bold mt-1 text-xs bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              ⚡ Admin Mode: Free Pass Activated
            </p>
          ) : (
            <p className="text-stone-300 font-medium mt-1 text-xs">
              Unlock <span className="text-rose-400 font-bold">Lifetime Access</span> for ₹199 (No recharges needed!)
            </p>
          )}

          {formData.referredBy && (
            <div className="mt-2 text-[11px] font-bold text-amber-300 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30 flex items-center space-x-1">
              <span>☕ Cafe / Partner Code:</span>
              <span className="font-mono text-white">{formData.referredBy}</span>
            </div>
          )}
        </div>

        <form onSubmit={handlePaymentAndRegister} className="space-y-3.5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="displayName"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500"
              placeholder="e.g. Ananya Sen"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Mobile Number with Placeholder */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase text-stone-300">
                Mobile Number
              </label>
              <span className="text-[10px] text-emerald-400 font-medium">
                Stored securely
              </span>
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500 font-mono"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition placeholder-stone-500"
              placeholder="••••••••"
            />
          </div>

          {/* Cultural & Lifestyle Dealbreakers (Diet, Intent, Gender) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#1c1827] border border-white/[0.15] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                Dietary Habit
              </label>
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                className="w-full bg-[#1c1827] border border-white/[0.15] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
              >
                <option value="Pure Veg">Pure Veg</option>
                <option value="Jain">Strict Jain</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
              Relationship Goal (No Situationships)
            </label>
            <select
              name="relationshipIntent"
              value={formData.relationshipIntent}
              onChange={handleChange}
              className="w-full bg-[#1c1827] border border-white/[0.15] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
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
            <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
              Partner Cafe / Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-3.5 py-2 text-xs font-mono uppercase focus:outline-none focus:border-rose-400 placeholder-stone-500"
              placeholder="e.g. CAFE_BLUETOKAI or FRIEND_CODE"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-black rounded-xl px-4 py-3.5 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4 flex justify-center items-center shadow-xl text-sm ${
              isAdmin
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gradient-to-r from-[#711a31] via-rose-600 to-amber-600 hover:opacity-90 text-white"
            }`}
          >
            {loading
              ? "Connecting..."
              : isAdmin
                ? "⚡ Enter Free as Admin"
                : "Pay ₹199 & Unlock Lifetime Access"}
          </button>
        </form>

        <p className="text-center text-stone-400 mt-5 text-xs font-medium">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-rose-400 hover:underline font-bold transition-colors ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
