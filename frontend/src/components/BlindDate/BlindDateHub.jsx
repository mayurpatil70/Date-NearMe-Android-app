"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Copy,
  Sparkles,
  ShieldCheck,
  Camera,
  Check,
  Flame,
  Coffee,
  Heart,
  Volume2,
  Users,
  Send,
  RefreshCw,
  AlertTriangle,
  Award,
  Lock,
  Unlock,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

// Partner Cafes for real-world date meetups
const PARTNER_CAFES = [
  {
    id: "subko-bandra",
    name: "Subko Coffee Roasters",
    area: "Bandra West, Mumbai",
    discount: "15% OFF",
    coupon: "DATE-SUBKO-15",
    perk: "Special couples quiet booth + free artisanal cookie with 2 coffees",
  },
  {
    id: "blue-tokai-fort",
    name: "Blue Tokai Coffee",
    area: "Fort Heritage, Mumbai",
    discount: "15% OFF",
    coupon: "DATE-BLUETOKAI-15",
    perk: "15% off sourdough croissants & cold brews on Date-NearMe check-in",
  },
  {
    id: "third-wave-bkc",
    name: "Third Wave Coffee",
    area: "BKC, Mumbai",
    discount: "15% OFF",
    coupon: "DATE-THIRDWAVE-15",
    perk: "Priority reserved date table + 15% discount on whole bill",
  },
  {
    id: "cafe-mondegar",
    name: "Cafe Mondegar",
    area: "Colaba, Mumbai",
    discount: "15% OFF",
    coupon: "DATE-MONDEGAR-15",
    perk: "Iconic jukebox date vibe + 15% off appetizers",
  },
];

// Curated icebreakers matching Hinge style & the scraped zip
const ICEBREAKERS = [
  "What is your most controversial food opinion?",
  "Rate your current week out of 10 and tell me why.",
  "What's a hill you will unconditionally die on?",
  "Best coffee spot in the city: hipster speciality or classic filter coffee?",
  "If you had to plan our first date in 5 words, what would they be?",
  "What's your biggest green flag that nobody notices?",
  "What song immediately puts you in an elite mood?",
];

// Simulated verified dater profiles for Blind Dating pool
const MOCK_BLIND_POOL = [
  {
    id: "blind-1",
    alias: "Bandra Architect",
    age: 24,
    city: "Bandra West, Mumbai",
    realName: "Anya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    prompts: [
      { q: "A shower thought I recently had", a: "Cafes with good Wi-Fi and good coffee simultaneously don't exist, change my mind." },
      { q: "Together, we could", a: "Rank every croissant in Bandra until we find the holy grail." }
    ],
    vibe: "Creative & Coffee Addict",
    ballerStats: { ovr: 92, vibe: 94, charm: 91, convo: 95, aura: 90, loyalty: 96, style: 93 },
    faceScore: 9.5,
  },
  {
    id: "blind-2",
    alias: "Indie Filmmaker",
    age: 26,
    city: "Khar, Mumbai",
    realName: "Kabir Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    prompts: [
      { q: "Dating me is like", a: "Always having a curated 35mm film playlist and endless midnight drive conversations." },
      { q: "The key to my heart", a: "Recommending an underrated jazz album." }
    ],
    vibe: "Cinematic & Soulful",
    ballerStats: { ovr: 89, vibe: 90, charm: 93, convo: 92, aura: 88, loyalty: 94, style: 91 },
    faceScore: 9.1,
  },
  {
    id: "blind-3",
    alias: "Tech Founder & Foodie",
    age: 25,
    city: "BKC / Juhu, Mumbai",
    realName: "Rhea Sen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    prompts: [
      { q: "My simple pleasures", a: "Third Wave cold brew on a rainy Mumbai evening." },
      { q: "Green flags I look for", a: "People who are genuinely kind to waitstaff and baristas." }
    ],
    vibe: "Ambitious & Playful",
    ballerStats: { ovr: 94, vibe: 95, charm: 92, convo: 96, aura: 93, loyalty: 97, style: 95 },
    faceScore: 9.7,
  },
];

export default function BlindDateHub({ onBackToDiscover }) {
  const { user } = useContext(AuthContext) || {};

  // Active top tab: "blind-date" | "discord-room" | "face-card"
  const [activeHubTab, setActiveHubTab] = useState("blind-date");

  // -------------------------------------------------------------
  // TAB 1: BLIND DATE MATCHING & 10-MIN SPEED DATE STATE
  // -------------------------------------------------------------
  const [matchIndex, setMatchIndex] = useState(0);
  const currentMatch = MOCK_BLIND_POOL[matchIndex % MOCK_BLIND_POOL.length];

  // 10-minute speed date timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Mutual photo reveal consent states
  const [userConsentedReveal, setUserConsentedReveal] = useState(false);
  const [partnerConsentedReveal, setPartnerConsentedReveal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showSafetyRules, setShowSafetyRules] = useState(false);

  // Blind Chat state
  const [blindMessages, setBlindMessages] = useState([
    {
      id: "bm-1",
      sender: "system",
      text: "🔒 Blind Date started! Photos stay blurred until both of you tap Reveal Photo.",
      time: "Just now",
    },
    {
      id: "bm-2",
      sender: "partner",
      text: "Hey! Love the blind date idea — no superficial swiping. What are you up to today?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleConsentReveal = () => {
    if (userConsentedReveal) return;
    setUserConsentedReveal(true);
    toast.success("You agreed to reveal! Waiting for your date...", { icon: "✨" });

    // Simulate partner agreeing after a playful 1.5s delay
    setTimeout(() => {
      setPartnerConsentedReveal(true);
      setIsRevealed(true);
      toast.success("Mutual Consent! Photos revealed!", { icon: "🎉", duration: 5000 });
      setBlindMessages((prev) => [
        ...prev,
        {
          id: `bm-${Date.now()}`,
          sender: "system",
          text: "✨ Mutual consent reached! Photos are now unblurred. You've officially unlocked each other!",
          time: "Just now",
        },
      ]);
    }, 1600);
  };

  const handleSendBlindMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `bm-${Date.now()}`,
      sender: "me",
      text: chatInput.trim(),
      time: "Just now",
    };
    setBlindMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate natural dater banter response
    setTimeout(() => {
      const partnerReplies = [
        "Haha totally agree with that!",
        "That's such a green flag tbh. What's your favourite cafe in the city?",
        "Okay wait, we might actually be on the exact same wavelength.",
        "Ready to reveal photos whenever you are! 😊",
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      setBlindMessages((prev) => [
        ...prev,
        {
          id: `bm-${Date.now() + 1}`,
          sender: "partner",
          text: randomReply,
          time: "Just now",
        },
      ]);
    }, 1400);
  };

  const handleNextMatch = () => {
    setMatchIndex((prev) => prev + 1);
    setUserConsentedReveal(false);
    setPartnerConsentedReveal(false);
    setIsRevealed(false);
    setTimeLeft(600);
    setIsTimerRunning(true);
    setBlindMessages([
      {
        id: `bm-${Date.now()}`,
        sender: "system",
        text: "🔒 New Blind Date started! Photos stay blurred until both agree to reveal.",
        time: "Just now",
      },
      {
        id: `bm-${Date.now() + 1}`,
        sender: "partner",
        text: "Hey there! Ready for some real banter without judging photos first?",
        time: "Just now",
      },
    ]);
    toast("Connected with a fresh nearby dater!", { icon: "🥂" });
  };

  // -------------------------------------------------------------
  // TAB 2: DISCORD-STYLE VOICE & STAGE ROOM STATE
  // -------------------------------------------------------------
  const [roomCode, setRoomCode] = useState("DATE-7749");
  const [inRoom, setInRoom] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isStageRevealed, setIsStageRevealed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [partnerSpeaking, setPartnerSpeaking] = useState(false);
  const [activeReactions, setActiveReactions] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(PARTNER_CAFES[0]);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [discordDrawerOpen, setDiscordDrawerOpen] = useState(false);
  const [roomMessages, setRoomMessages] = useState([
    { user: "System", text: "Welcome to Discord Stage #DATE-7749. High fidelity voice audio enabled.", role: "BOT" },
    { user: "Anya (Dater)", text: "Hey! Mic is working loud and clear. Love this stage setup!", role: "SPEAKER" },
  ]);
  const [roomChatInput, setRoomChatInput] = useState("");

  // Speaking pulse simulation
  useEffect(() => {
    if (!inRoom) return;
    const interval = setInterval(() => {
      setPartnerSpeaking((prev) => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, [inRoom]);

  const handleGenerateRoomCode = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newCode = `DATE-${rand}`;
    setRoomCode(newCode);
    toast.success(`Generated new Discord Room: ${newCode}`);
  };

  const handleCopyInvite = () => {
    const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/blind-date?room=${roomCode}` : `https://datenearme.vercel.app/blind-date?room=${roomCode}`;
    navigator.clipboard?.writeText(inviteUrl);
    toast.success("Room invite copied! Send to your date on WhatsApp / IG 🔗", { duration: 4000 });
  };

  const handleTriggerReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setActiveReactions((prev) => [...prev, { id, emoji, left: Math.floor(20 + Math.random() * 60) }]);
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  const handleSendRoomChat = (e) => {
    if (e) e.preventDefault();
    if (!roomChatInput.trim()) return;
    setRoomMessages((prev) => [
      ...prev,
      { user: user?.displayName || user?.name || "You", text: roomChatInput.trim(), role: "HOST" },
    ]);
    setRoomChatInput("");
  };

  const handleClaimDatePass = () => {
    setClaimedCoupon(selectedCafe.coupon);
    toast.success(`Claimed 15% OFF at ${selectedCafe.name}! Coupon: ${selectedCafe.coupon}`, {
      duration: 6000,
      icon: "☕",
    });
  };

  // -------------------------------------------------------------
  // TAB 3: FIFA BALLER CARD & AI FACE CARD SCORE STATE
  // -------------------------------------------------------------
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [faceScanComplete, setFaceScanComplete] = useState(true);
  const [ballerStats, setBallerStats] = useState({
    ovr: 91,
    vibe: 93,
    charm: 89,
    convo: 94,
    aura: 92,
    loyalty: 98,
    style: 90,
    transferValue: "₹120,000,000",
    tier: "ELITE ROMANTIC",
    position: "CAPTAIN · ST",
  });

  const handleScanSelfie = () => {
    setIsScanningFace(true);
    setFaceScanComplete(false);
    toast("AI Face Card scanner analyzing symmetry & jawline...", { icon: "🔍" });

    setTimeout(() => {
      setIsScanningFace(false);
      setFaceScanComplete(true);
      const newOvr = Math.floor(90 + Math.random() * 8);
      setBallerStats({
        ovr: newOvr,
        vibe: Math.floor(91 + Math.random() * 8),
        charm: Math.floor(88 + Math.random() * 11),
        convo: Math.floor(90 + Math.random() * 9),
        aura: Math.floor(89 + Math.random() * 10),
        loyalty: 98,
        style: Math.floor(90 + Math.random() * 9),
        transferValue: `₹${(newOvr * 1.4).toFixed(1)}M`,
        tier: newOvr >= 94 ? "ICONIC WORLD CLASS" : "ELITE ROMANTIC",
        position: "CAPTAIN · ST",
      });
      toast.success("Face Card Validated! Face Card Never Declines 💳✨", { icon: "🏆", duration: 5000 });
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl px-4 pt-4 pb-32 flex flex-col space-y-5 z-10 mx-auto">
      {/* =========================================================
          TOP BANNER: DATE-NEARME HINGE HEADER & ROUTE SWITCHER
         ========================================================= */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-5 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#711A31] to-rose-700 text-white flex items-center justify-center text-xl font-serif font-black shadow-md border-2 border-white">
            🎭
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-serif font-black text-stone-900 tracking-tight">
                Blind Date & Voice Room
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#711A31] px-2 py-0.5 rounded-full border border-rose-200">
                Live
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Vibe first · mutual photo reveal · Discord voice lounge
            </p>
          </div>
        </div>

        {onBackToDiscover && (
          <button
            onClick={onBackToDiscover}
            className="text-xs font-bold text-stone-600 hover:text-[#711A31] bg-stone-100 hover:bg-stone-200/80 px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
          >
            ← Back to Discover
          </button>
        )}
      </div>

      {/* =========================================================
          SUB-TAB NAVIGATION PILLS (Hinge Style)
         ========================================================= */}
      <div className="flex items-center justify-center bg-stone-200/60 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveHubTab("blind-date")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeHubTab === "blind-date"
              ? "bg-white text-[#711A31] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>🎭</span>
          <span>10-Min Speed Date</span>
        </button>

        <button
          onClick={() => setActiveHubTab("discord-room")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeHubTab === "discord-room"
              ? "bg-white text-[#711A31] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>🎙️</span>
          <span>Discord Voice Room</span>
        </button>

        <button
          onClick={() => setActiveHubTab("face-card")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeHubTab === "face-card"
              ? "bg-white text-[#711A31] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span>⚽</span>
          <span>FIFA Baller Card</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: 10-MINUTE BLIND DATE & MUTUAL PHOTO REVEAL
         ========================================================= */}
      {activeHubTab === "blind-date" && (
        <div className="space-y-4">
          {/* SPEED TIMER & ACTIVE MATCH CARD */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-stone-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
            {/* Top Bar: Timer & Actions */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-[#711A31] flex items-center justify-center text-xs font-black">
                  ⏱️
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">
                    Speed Date Timer
                  </span>
                  <span className="text-lg font-mono font-black text-[#711A31]">
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSafetyRules(!showSafetyRules)}
                  className="text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safety Rules</span>
                </button>

                <button
                  onClick={handleNextMatch}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Skip / Next Match</span>
                </button>
              </div>
            </div>

            {/* SAFETY RULES EXPANDABLE ACCORDION (from zip) */}
            {showSafetyRules && (
              <div className="mb-5 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span className="flex items-center space-x-1.5">
                    <span>🛡️</span>
                    <span>Date-NearMe Blind Date Safety Rules</span>
                  </span>
                  <button onClick={() => setShowSafetyRules(false)} className="text-stone-400 hover:text-stone-600">
                    ✕
                  </button>
                </div>
                <ul className="space-y-1.5 text-[11px] text-stone-600 list-disc list-inside">
                  <li><strong>Photos Hidden:</strong> Avatars remain completely blurred until both users mutually agree to reveal.</li>
                  <li><strong>10-Minute Speed Date:</strong> Chat, discover compatibility and mutual vibes without ghosting.</li>
                  <li><strong>Mutual Consent Only:</strong> If either person prefers to stay anonymous, photos never unblur.</li>
                  <li><strong>Zero Tolerance:</strong> Inappropriate banter or harassment leads to immediate permanent device ban.</li>
                </ul>
              </div>
            )}

            {/* BLIND DATER PROFILE CARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              {/* Photo Card with Dynamic Blur & Unlock Animation */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-900 shadow-inner group">
                <img
                  src={currentMatch.avatar}
                  alt={currentMatch.alias}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    isRevealed
                      ? "blur-0 scale-100"
                      : "blur-2xl scale-110 opacity-70"
                  }`}
                />

                {/* Privacy Overlay when Blurred */}
                {!isRevealed && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center text-2xl mb-3 shadow-lg">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-serif font-black text-lg text-white">
                      Photo Blurred for Privacy
                    </span>
                    <p className="text-[11px] text-stone-200 mt-1 max-w-[220px]">
                      Chat first. Faces unlock only when both of you tap Reveal Photo.
                    </p>

                    <div className="mt-4 flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${userConsentedReveal ? "bg-emerald-500/80 text-white" : "bg-white/20 text-stone-200"}`}>
                        {userConsentedReveal ? "✓ You agreed" : "You: Pending"}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${partnerConsentedReveal ? "bg-emerald-500/80 text-white" : "bg-white/20 text-stone-200"}`}>
                        {partnerConsentedReveal ? "✓ Date agreed" : "Date: Pending"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Verified Badge when Revealed */}
                {isRevealed && (
                  <div className="absolute top-4 left-4 bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>MUTUAL REVEAL VERIFIED</span>
                  </div>
                )}

                <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base">
                        {isRevealed ? currentMatch.realName : currentMatch.alias}, {currentMatch.age}
                      </h3>
                      <p className="text-[10px] text-stone-300 font-medium">📍 {currentMatch.city}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#711A31] text-white px-2 py-0.5 rounded-full">
                      {currentMatch.vibe}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hinge Prompts & Mutual Reveal Action */}
              <div className="flex flex-col space-y-3.5">
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    {currentMatch.prompts[0].q}
                  </span>
                  <p className="text-xs font-serif font-bold text-stone-800">
                    "{currentMatch.prompts[0].a}"
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    {currentMatch.prompts[1].q}
                  </span>
                  <p className="text-xs font-serif font-bold text-stone-800">
                    "{currentMatch.prompts[1].a}"
                  </p>
                </div>

                {/* MUTUAL REVEAL CTA BUTTON */}
                <div className="pt-2">
                  {!isRevealed ? (
                    <button
                      onClick={handleConsentReveal}
                      disabled={userConsentedReveal}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        userConsentedReveal
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-[#711A31] hover:bg-[#581426] text-white active:scale-95"
                      }`}
                    >
                      {userConsentedReveal ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                          <span>Waiting for date to consent to reveal...</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Tap to Consent & Reveal Photos ✨</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center text-xs text-emerald-800 font-bold flex items-center justify-center space-x-2">
                      <span>🎉 Both consented! Photos unlocked and chat added to Matches.</span>
                    </div>
                  )}
                </div>

                {/* Quick Icebreaker Suggestions */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    💡 Quick Icebreakers to ask:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ICEBREAKERS.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setChatInput(prompt)}
                        className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition text-left truncate max-w-full cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* REAL-TIME BLIND CHAT STREAM */}
            <div className="mt-6 pt-5 border-t border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-900 flex items-center space-x-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#711A31]" />
                  <span>Real-Time Speed Date Chat</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Encrypted 1-on-1</span>
              </div>

              {/* Message scroll box */}
              <div className="h-44 overflow-y-auto bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-2 mb-3">
                {blindMessages.map((msg) => {
                  if (msg.sender === "system") {
                    return (
                      <div key={msg.id} className="text-center my-1.5">
                        <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-2.5 py-0.5 rounded-full inline-block">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs font-medium shadow-sm ${
                          isMe
                            ? "bg-[#711A31] text-white rounded-br-xs"
                            : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-stone-400 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendBlindMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type an anonymous message or answer an icebreaker..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-[#711A31] hover:bg-[#581426] disabled:opacity-40 text-white p-2.5 rounded-2xl transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: DISCORD-STYLE VOICE & STAGE ROOM
         ========================================================= */}
      {activeHubTab === "discord-room" && (
        <div className="space-y-4">
          {!inRoom ? (
            /* CREATE OR JOIN DISCORD ROOM LOBBY */
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-stone-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.06)] text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] flex items-center justify-center text-3xl mx-auto shadow-sm">
                🎙️
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5865F2] bg-[#5865F2]/10 px-3 py-1 rounded-full border border-[#5865F2]/20">
                  Discord Stage Mode
                </span>
                <h2 className="text-2xl font-serif font-black text-stone-900 mt-2">
                  Create a Date Lounge Room
                </h2>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Start an audio/video room with custom room codes, Discord-like voice stage,
                  instant invite links, and partner cafe perks.
                </p>
              </div>

              {/* Room Code Box */}
              <div className="max-w-xs mx-auto bg-stone-100 border border-stone-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Room Code</span>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="bg-transparent font-mono font-black text-base text-stone-900 focus:outline-none w-32 uppercase"
                  />
                </div>
                <button
                  onClick={handleGenerateRoomCode}
                  className="text-xs text-stone-500 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-200 transition cursor-pointer"
                  title="Generate new code"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Lobby Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setInRoom(true);
                    toast.success(`Joined Discord Voice Room #${roomCode}!`, { icon: "🎙️" });
                  }}
                  className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Launch Discord Stage Room</span>
                </button>

                <button
                  onClick={handleCopyInvite}
                  className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-5 py-3.5 rounded-2xl border border-stone-200 transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copy Invite Link</span>
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-left">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-lg">🔊</span>
                  <h4 className="font-bold text-[11px] text-stone-900 mt-1">Spatial Audio</h4>
                  <p className="text-[10px] text-stone-500">Crystal clear voice with speaking waves</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-lg">🎭</span>
                  <h4 className="font-bold text-[11px] text-stone-900 mt-1">Stage Reveal</h4>
                  <p className="text-[10px] text-stone-500">Unblur video when both daters agree</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-lg">☕</span>
                  <h4 className="font-bold text-[11px] text-stone-900 mt-1">Cafe Perks</h4>
                  <p className="text-[10px] text-stone-500">15% off Subko & Blue Tokai date pass</p>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE DISCORD STAGE ROOM INTERFACE */
            <div className="bg-[#1e1f22] text-white rounded-[2.5rem] p-6 shadow-2xl border border-stone-800 relative overflow-hidden">
              {/* Floating Live Reaction Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                {activeReactions.map((r) => (
                  <span
                    key={r.id}
                    className="absolute bottom-16 text-3xl animate-floatUp"
                    style={{ left: `${r.left}%` }}
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>

              {/* Stage Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-stone-200">
                        #{roomCode}
                      </span>
                      <span className="bg-[#5865F2]/20 text-[#5865F2] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#5865F2]/40">
                        STAGE LIVE
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">Date-NearMe Discord Lounge</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyInvite}
                    className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-stone-200 px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                  <button
                    onClick={() => setDiscordDrawerOpen(!discordDrawerOpen)}
                    className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-stone-200 px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* DISCORD VOICE STAGE GRID */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Speaker 1: Host (You) */}
                <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-[#2b2d31] border border-white/10 flex flex-col items-center justify-center p-4 overflow-hidden group">
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl font-serif font-black transition-all duration-300 ${
                      !isMicMuted && isSpeaking
                        ? "ring-4 ring-emerald-500 ring-offset-4 ring-offset-[#2b2d31] scale-105"
                        : "border-2 border-white/20"
                    } bg-gradient-to-tr from-[#711A31] to-rose-700 text-white shadow-xl`}
                  >
                    {(user?.displayName?.[0] || user?.name?.[0] || "U").toUpperCase()}

                    {/* Mute icon badge */}
                    {isMicMuted && (
                      <div className="absolute -bottom-1 -right-1 bg-rose-600 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#2b2d31]">
                        <MicOff className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <span className="font-bold text-xs text-white block">
                      {user?.displayName || user?.name || "You"}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {!isMicMuted ? "🎙️ Speaking" : "Muted"} · Host
                    </span>
                  </div>
                </div>

                {/* Speaker 2: Matched Dater */}
                <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-[#2b2d31] border border-white/10 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-serif font-black transition-all duration-300 ${
                      partnerSpeaking
                        ? "ring-4 ring-emerald-500 ring-offset-4 ring-offset-[#2b2d31] scale-105"
                        : "border-2 border-white/20"
                    } bg-stone-800 shadow-xl`}
                  >
                    <img
                      src={currentMatch.avatar}
                      alt={currentMatch.alias}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isStageRevealed ? "blur-0" : "blur-xl"
                      }`}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <span className="font-bold text-xs text-white block">
                      {isStageRevealed ? currentMatch.realName : currentMatch.alias}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {partnerSpeaking ? "🎙️ Speaking..." : "Listening"} · Dater
                    </span>
                  </div>
                </div>
              </div>

              {/* DISCORD STAGE CHANNEL CONTROL BAR */}
              <div className="bg-[#2b2d31] rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-2">
                {/* Mic Toggle */}
                <button
                  onClick={() => {
                    setIsMicMuted(!isMicMuted);
                    toast(!isMicMuted ? "Microphone Muted" : "Microphone Active", {
                      icon: !isMicMuted ? "🔴" : "🟢",
                    });
                  }}
                  className={`p-3 rounded-xl transition cursor-pointer ${
                    isMicMuted
                      ? "bg-rose-600/80 text-white hover:bg-rose-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Camera Video Toggle */}
                <button
                  onClick={() => {
                    setIsCameraOn(!isCameraOn);
                    toast(isCameraOn ? "Camera Turned Off" : "Camera Turned On", {
                      icon: "📹",
                    });
                  }}
                  className={`p-3 rounded-xl transition cursor-pointer ${
                    isCameraOn
                      ? "bg-emerald-600/80 text-white hover:bg-emerald-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Mutual Stage Reveal Toggle */}
                <button
                  onClick={() => {
                    setIsStageRevealed(!isStageRevealed);
                    toast.success(!isStageRevealed ? "Stage Video Unblurred!" : "Stage Video Blurred");
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isStageRevealed
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-white/10 text-stone-200 hover:bg-white/20"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">
                    {isStageRevealed ? "Photos Revealed" : "Unblur Stage"}
                  </span>
                </button>

                {/* Live Soundboard / Reactions */}
                <div className="flex items-center space-x-1 bg-white/5 rounded-xl p-1">
                  {["❤️", "🔥", "🥂", "☕", "😂"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleTriggerReaction(emoji)}
                      className="hover:scale-125 active:scale-95 transition text-base p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Hangup / Leave Call */}
                <button
                  onClick={() => {
                    setInRoom(false);
                    toast("Left Discord voice stage", { icon: "👋" });
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl transition cursor-pointer"
                  title="Leave Discord Room"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>

              {/* IN-ROOM DISCORD TEXT CHAT DRAWER */}
              {discordDrawerOpen && (
                <div className="mt-4 bg-[#2b2d31] rounded-2xl p-4 border border-white/10 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                    <span>💬 In-Room Discord Chat</span>
                    <button
                      onClick={() => setDiscordDrawerOpen(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="h-32 overflow-y-auto space-y-2 pr-1 text-xs">
                    {roomMessages.map((msg, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-[10px] font-black text-[#5865F2] uppercase bg-[#5865F2]/20 px-1.5 py-0.5 rounded">
                          {msg.role}
                        </span>
                        <div>
                          <span className="font-bold text-stone-200 mr-1.5">{msg.user}:</span>
                          <span className="text-stone-300">{msg.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendRoomChat} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Send a message to the room..."
                      value={roomChatInput}
                      onChange={(e) => setRoomChatInput(e.target.value)}
                      className="flex-1 bg-[#1e1f22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                    />
                    <button
                      type="submit"
                      className="bg-[#5865F2] hover:bg-[#4752C4] text-white p-2 rounded-xl transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* PARTNER CAFE DATE PASS INTEGRATION */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white flex items-center space-x-1.5">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <span>Plan Your Real-World Cafe Date</span>
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Pick a partner cafe to unlock an instant 15% discount Date Pass coupon!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PARTNER_CAFES.map((cafe) => (
                    <div
                      key={cafe.id}
                      onClick={() => setSelectedCafe(cafe)}
                      className={`p-3 rounded-2xl border transition cursor-pointer ${
                        selectedCafe.id === cafe.id
                          ? "bg-white/15 border-amber-400/80 shadow-md"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{cafe.name}</span>
                        <span className="text-[10px] font-black bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full">
                          {cafe.discount}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5">{cafe.area}</p>
                      <p className="text-[10px] text-amber-200/90 mt-1.5">{cafe.perk}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10">
                  <div className="text-xs">
                    <span className="text-stone-400 block text-[10px]">Selected Cafe</span>
                    <strong className="text-white">{selectedCafe.name} ({selectedCafe.area})</strong>
                  </div>

                  <button
                    onClick={handleClaimDatePass}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    {claimedCoupon ? `✓ ${claimedCoupon}` : "Claim 15% Date Pass"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 3: FIFA BALLER CARD & AI FACE CARD SCORE (from zip)
         ========================================================= */}
      {activeHubTab === "face-card" && (
        <div className="space-y-5">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-stone-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="text-center max-w-md mx-auto mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                AI Face Card & FUT Baller
              </span>
              <h2 className="text-2xl font-serif font-black text-stone-900 mt-2">
                Your AI Baller Card
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Turn your profile into a FIFA-style Ultimate Team card with OVR rating,
                6 attributes, and market transfer valuation.
              </p>
            </div>

            {/* BALLER CARD DISPLAY */}
            <div className="flex flex-col items-center justify-center">
              {/* FIFA Ultimate Team Golden Card Container */}
              <div className="relative w-72 sm:w-80 rounded-[2.5rem] p-5 shadow-2xl overflow-hidden bg-gradient-to-b from-[#fcd34d] via-[#b45309] to-[#78350f] border-4 border-[#fef08a] text-stone-900">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 pointer-events-none" />

                {/* Top Card Info: OVR + Position + Shield */}
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-mono font-black tracking-tighter text-stone-950 leading-none">
                      {ballerStats.ovr}
                    </span>
                    <span className="text-[11px] font-black uppercase text-amber-950 tracking-wider">
                      {ballerStats.position.split(" ")[0]}
                    </span>
                    <span className="text-xs mt-1">🇮🇳</span>
                  </div>

                  {/* Selfie / Avatar inside Card */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-3 border-amber-200 shadow-xl bg-stone-900">
                    <img
                      src={user?.profile_photo_url || user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                      alt="Baller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Dater Name & Nation / Club */}
                <div className="text-center relative z-10 mt-2 mb-3">
                  <h3 className="text-lg font-serif font-black uppercase tracking-wide text-stone-950">
                    {user?.displayName || user?.name || "ARCHIE"}
                  </h3>
                  <div className="flex items-center justify-center space-x-1.5 text-[10px] font-black text-amber-950 uppercase tracking-widest">
                    <span>DATE-NEARME FC</span>
                    <span>•</span>
                    <span>{ballerStats.tier}</span>
                  </div>
                </div>

                {/* 6 FIFA ATTRIBUTES GRID (PAC, DRI, PAS, PHY, DEF, SHO) */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-stone-950 relative z-10 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.vibe}</span>
                    <span className="font-bold text-[11px] text-white">VIB (Pace)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.charm}</span>
                    <span className="font-bold text-[11px] text-white">RIZ (Charm)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.convo}</span>
                    <span className="font-bold text-[11px] text-white">PAS (Banter)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.aura}</span>
                    <span className="font-bold text-[11px] text-white">AUR (Style)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.loyalty}</span>
                    <span className="font-bold text-[11px] text-white">LOY (Green Flag)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-100">{ballerStats.style}</span>
                    <span className="font-bold text-[11px] text-white">FUD (Foodie)</span>
                  </div>
                </div>

                {/* Transfer Value Badge */}
                <div className="mt-3 text-center relative z-10 bg-amber-200/90 rounded-xl py-1 px-2 border border-amber-300">
                  <span className="text-[10px] font-black uppercase text-amber-950 tracking-wider">
                    MARKET VALUE: {ballerStats.transferValue}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Re-scan Selfie or Share Card */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-sm">
                <button
                  onClick={handleScanSelfie}
                  disabled={isScanningFace}
                  className="flex-1 bg-[#711A31] hover:bg-[#581426] disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanningFace ? "Analyzing Face..." : "Re-Scan Face Card"}</span>
                </button>

                <button
                  onClick={() => {
                    toast.success("Baller Card link copied! Ready to flex on Instagram Stories 🌟");
                  }}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3.5 px-4 rounded-2xl border border-stone-200 transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-stone-600" />
                  <span>Share Card</span>
                </button>
              </div>
            </div>

            {/* AI GLOW-UP BLUEPRINT (from zip) */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">✨</span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  AI Face Card & Glow-Up Blueprint
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-stone-800">Symmetry & Ratios</span>
                    <span className="text-xs font-mono font-black text-emerald-600">96%</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Facial thirds and golden ratio balance qualify as elite tier.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-stone-800">Jawline Definition</span>
                    <span className="text-xs font-mono font-black text-emerald-600">93%</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Strong contouring detected. Golden hour sunlight will maximize profile engagement.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-stone-800">Face Card Status</span>
                    <span className="text-xs font-mono font-black text-[#711A31]">VALID</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Status: Unlimited Credit. Face card never declines in Mumbai or Delhi!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
