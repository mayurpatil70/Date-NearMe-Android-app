"use client";

import React, { useState } from "react";
import { Info, SlidersHorizontal, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function HingeHeader({
  activeTab,
  rosesRemaining = 1,
  onRosePillClick,
  strictDealbreakers = false,
  onToggleDealbreakers,
  showRoseInLikes = false,
}) {
  const [showStandoutsInfo, setShowStandoutsInfo] = useState(false);

  return (
    <header className="w-full px-5 pt-5 pb-3 flex items-center justify-between border-b border-stone-150/70 bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Dynamic Left Title */}
      <div className="flex items-center space-x-2">
        {activeTab === "map" && (
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
              Near Me Map
            </h1>
          </div>
        )}

        {(activeTab === "standouts" || (activeTab === "likes" && showRoseInLikes)) && (
          <div className="flex items-center space-x-1.5">
            <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
              Likes & Standouts
            </h1>
            <button
              onClick={() => {
                setShowStandoutsInfo(!showStandoutsInfo);
                toast("Standouts are curated daily based on prompt resonance and shared values.", {
                  icon: "💡",
                });
              }}
              className="text-stone-400 hover:text-stone-700 transition"
              title="About Standouts"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === "likes" && !showRoseInLikes && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Likes You
          </h1>
        )}

        {activeTab === "discover" && (
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-2xl tracking-tighter text-[#711A31]">
              H
            </span>
            <h1 className="text-xl font-serif font-black tracking-tight text-stone-900">
              Discover
            </h1>
          </div>
        )}

        {activeTab === "matches" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Matches
          </h1>
        )}

        {activeTab === "profile" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Profile
          </h1>
        )}

        {activeTab === "feed" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Feed
          </h1>
        )}

        {activeTab === "reels" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Reels
          </h1>
        )}

        {activeTab === "cafes" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Date-NearMe IRL
          </h1>
        )}

        {activeTab === "affiliate" && (
          <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">
            Affiliate Hub
          </h1>
        )}
      </div>

      {/* Dynamic Right Actions */}
      <div className="flex items-center space-x-2">
        {/* Mauve Rose Pill when in Standouts or Likes Standouts sub-view */}
        {(activeTab === "standouts" || (activeTab === "likes" && showRoseInLikes)) && (
          <button
            onClick={
              onRosePillClick ||
              (() => toast("You get 1 free Rose every week to send to your top standout!", { icon: "🌹" }))
            }
            className="bg-[#BBA7BE] hover:bg-[#AE97B1] text-[#241026] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 border border-[#A68EA5]/40 shadow-sm transition active:scale-95"
          >
            <span>🌹</span>
            <span>Roses ({rosesRemaining})</span>
          </button>
        )}

        {/* Discover Filter Toggle */}
        {activeTab === "discover" && onToggleDealbreakers && (
          <button
            onClick={onToggleDealbreakers}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center space-x-1.5 transition active:scale-95 shadow-sm ${
              strictDealbreakers
                ? "bg-rose-50 text-[#711A31] border-rose-200"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{strictDealbreakers ? "Strict ON" : "Filters"}</span>
          </button>
        )}
      </div>
    </header>
  );
}
