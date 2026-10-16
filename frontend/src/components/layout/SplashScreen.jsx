import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the login/register screen after 3.5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col justify-center items-center overflow-hidden relative selection:bg-rose-500 selection:text-white">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-pink-500/20 via-rose-500/15 to-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Main Brand Logo Container */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center transform transition-all duration-700">
        <div className="w-48 h-48 md:w-56 md:h-56 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-500">
          <img
            src="/logo.png"
            alt="Date-NearMe Logo"
            className="w-full h-full object-contain rounded-2xl drop-shadow-xl"
          />
        </div>

        <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide max-w-xs">
          Real connections, authentic vibes, zero ghosting.
        </p>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-12 flex flex-col items-center space-y-3 z-10">
        <div className="w-7 h-7 border-3 border-white/20 border-t-rose-500 rounded-full animate-spin"></div>
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Finding Your Vibe
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
