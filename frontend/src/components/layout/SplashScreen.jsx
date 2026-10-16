"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the login/register screen after 3.5 seconds
    const timer = setTimeout(() => {
      if (router && typeof router.push === "function") {
        router.push("/login");
      } else if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen bg-[#FAF8F5] flex flex-col justify-center items-center overflow-hidden relative selection:bg-[#711A31] selection:text-white font-sans">
      {/* Subtle Ambient Glossy Warm Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-pink-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Main Brand Logo Container - High Gloss Glass Card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center transform transition-all duration-700">
        <div className="w-44 h-44 md:w-52 md:h-52 p-4 rounded-[2.5rem] bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(113,26,49,0.08),0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-500 relative">
          {/* Top specular glossy reflection line */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent rounded-full pointer-events-none"></div>
          <img
            src="/logo.png"
            alt="Date-NearMe Logo"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <h1 className="font-serif text-3xl font-black text-stone-900 tracking-tight mb-2">
          Date-NearMe
        </h1>

        <p className="text-stone-500 text-sm md:text-base font-medium tracking-wide max-w-xs leading-relaxed">
          The intentional dating experience designed to be deleted.
        </p>

        <div className="mt-8 flex items-center space-x-3">
          <button
            onClick={() => router.push("/register")}
            className="bg-[#711A31] hover:bg-[#541223] text-white font-bold text-xs py-3 px-6 rounded-full shadow-md transition active:scale-95"
          >
            Create Account
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs py-3 px-6 rounded-full shadow-sm transition active:scale-95"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-12 flex flex-col items-center space-y-3 z-10">
        <div className="w-7 h-7 border-3 border-stone-200 border-t-[#711A31] rounded-full animate-spin"></div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
          Finding Your Vibe
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
