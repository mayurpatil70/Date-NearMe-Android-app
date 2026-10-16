"use client";

import React from "react";
import { Star, Heart, MessageSquare, Info } from "lucide-react";

export default function HingeNavBar({ activeTab, onTabChange, matchesCount = 0, unreadCount = 0, userAvatar = "" }) {
  const tabs = [
    {
      id: "discover",
      label: "Discover",
      icon: (
        <span className="font-serif font-black text-xl leading-none select-none tracking-tighter">
          H
        </span>
      ),
    },
    {
      id: "standouts",
      label: "Standouts",
      icon: <Star className="w-5 h-5 fill-current" strokeWidth={1.5} />,
    },
    {
      id: "likes",
      label: "Likes You",
      icon: <Heart className="w-5 h-5 fill-current" strokeWidth={1.5} />,
    },
    {
      id: "matches",
      label: "Matches",
      icon: (
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
          )}
        </div>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-current flex items-center justify-center bg-stone-100">
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-black uppercase">U</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-2xl rounded-full shadow-hinge-nav border border-stone-200/70 px-3 sm:px-4 py-2 flex items-center justify-between gap-1 sm:gap-2 max-w-sm w-[92%] transition-all duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 rounded-full ${
              isActive
                ? "bg-[#ECE5E8] text-[#711A31] px-3 py-1 font-bold shadow-sm"
                : "text-stone-400 hover:text-stone-700 px-2.5 py-1"
            }`}
            title={tab.label}
          >
            <div className="flex items-center justify-center">{tab.icon}</div>
            <span className="text-[9px] font-semibold tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
