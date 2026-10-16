"use client";

import React, { useState, useEffect } from "react";
import { Zap, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function HingeLikesYouEmpty({ onBoostClick, onUpgradeClick }) {
  const [boostSeconds, setBoostSeconds] = useState(59 * 60 + 21); // 59:21 from screenshot

  useEffect(() => {
    const timer = setInterval(() => {
      setBoostSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 py-8 max-w-md mx-auto animate-fadeIn">
      {/* Hand-drawn line art illustration with blush pink wash (exact match to Screenshot 3) */}
      <div className="relative w-64 h-56 flex items-center justify-center mb-6">
        {/* Soft blush pink watercolor wash blob */}
        <div className="absolute inset-2 bg-[#FDEAE6] rounded-[45%_55%_60%_40%/50%_60%_40%_50%] transform -rotate-3 transition duration-700 pointer-events-none" />

        {/* Hand-drawn sketchy birds & city skyline SVG */}
        <svg
          viewBox="0 0 240 200"
          className="relative w-full h-full drop-shadow-sm select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* City skyline silhouettes at bottom */}
          <path
            d="M 50 160 L 65 145 L 80 160 L 95 150 L 110 160 L 130 148 L 145 160 L 160 142 L 175 160 L 195 152 L 205 160"
            stroke="#1C1917"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bridge arches & water tower */}
          <path
            d="M 60 160 Q 75 140 90 160 M 165 142 L 165 130 L 175 130 L 175 142 M 170 130 L 170 125"
            stroke="#1C1917"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Silhouetted people on rooftop */}
          <circle cx="150" cy="148" r="2" fill="#1C1917" />
          <path d="M 150 150 L 150 156" stroke="#1C1917" strokeWidth="2" />
          <circle cx="155" cy="149" r="2" fill="#1C1917" />
          <path d="M 155 151 L 155 156" stroke="#1C1917" strokeWidth="2" />

          {/* Large Lead Dove (Center) */}
          <g transform="translate(65, 30)">
            {/* Dove Body */}
            <path
              d="M 50 55 Q 35 40 25 50 Q 15 65 30 75 Q 45 85 55 75 Q 65 65 50 55 Z"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Head & Beak */}
            <circle cx="28" cy="46" r="12" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
            <circle cx="26" cy="44" r="2" fill="#1C1917" />
            <path d="M 18 46 L 10 49 L 18 52" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />
            {/* Left Wing (Spread high) */}
            <path
              d="M 36 45 C 20 20 -10 25 -25 35 C -15 48 5 48 26 55"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Wing Feather details */}
            <path d="M -15 35 Q 0 35 15 48 M -5 32 Q 10 32 20 45" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            {/* Right Wing (Looping behind) */}
            <path
              d="M 45 50 C 60 25 80 30 90 42 C 80 55 65 60 48 65"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 70 38 Q 65 48 50 58" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            {/* Tail Feathers */}
            <path
              d="M 42 75 L 40 100 L 48 95 L 56 100 L 52 75"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Left Companion Dove */}
          <g transform="translate(30, 80) scale(0.65)">
            <path
              d="M 30 40 Q 15 25 10 40 Q 5 55 20 60 Q 35 65 40 50 Z"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
            />
            <circle cx="16" cy="36" r="8" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
            <circle cx="14" cy="34" r="1.5" fill="#1C1917" />
            <path d="M 8 36 L 2 38" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 20 35 C 5 15 -10 20 -15 30 C -5 40 10 40 20 45" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          </g>

          {/* Right Companion Dove */}
          <g transform="translate(135, 60) scale(0.7)">
            <path
              d="M 30 40 Q 15 25 10 40 Q 5 55 20 60 Q 35 65 40 50 Z"
              fill="#FFFFFF"
              stroke="#1C1917"
              strokeWidth="2.5"
            />
            <circle cx="16" cy="36" r="8" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
            <circle cx="14" cy="34" r="1.5" fill="#1C1917" />
            <path d="M 8 36 L 2 38" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 20 35 C 35 15 50 20 55 30 C 45 40 30 40 20 45" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          </g>

          {/* Subtle flight flurry birds in distance */}
          <path d="M 60 70 Q 65 65 70 70 Q 75 65 80 70" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 170 85 Q 175 80 180 85 Q 185 80 190 85" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 120 110 Q 124 106 128 110 Q 132 106 136 110" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Editorial Serif Heading matching Screenshot 3 */}
      <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mb-2">
        You're new, no likes yet
      </h2>

      {/* Neutral Subtitle */}
      <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-8">
        We can help you get your first one sooner.
      </p>

      {/* Action Buttons matching Screenshot 3 */}
      <div className="w-full max-w-xs space-y-3">
        {/* Primary CTA: Deep Forest Teal Pill */}
        <button
          onClick={
            onBoostClick ||
            (() => toast.success("⚡ Profile Boost activated! Priority queue for 60 minutes.", { icon: "🚀" }))
          }
          className="w-full bg-[#0B6B67] hover:bg-[#085552] text-white font-bold py-3.5 px-6 rounded-full shadow-sm flex items-center justify-center space-x-2 transition active:scale-95 text-sm"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>50% off Boost | {formatTimer(boostSeconds)}</span>
        </button>

        {/* Secondary CTA: Crisp White Pill with Stone Outline */}
        <button
          onClick={
            onUpgradeClick ||
            (() => toast("Date-NearMe VIP: Unlimited likes & priority queue unlocked!", { icon: "✨" }))
          }
          className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold py-3.5 px-6 rounded-full shadow-sm flex items-center justify-center space-x-2 transition active:scale-95 text-sm"
        >
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>Upgrade to HingeX</span>
        </button>
      </div>
    </div>
  );
}
