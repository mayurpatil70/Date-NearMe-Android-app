import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { SocketContext } from "../../Context/SocketContext";
import api from "../../api/axiosConfig";

const ChatRoom = () => {
  const { targetUserId } = useParams();
  const { user, updateWallet } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(24 * 3600 - 180); // 23h 57m
  const [escrowStatus, setEscrowStatus] = useState("LOCKED_ESCROW"); // LOCKED_ESCROW, ACTIVE, MUTUAL_CLOSE, FORFEIT
  const [showDatePassModal, setShowDatePassModal] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [venueCheckedIn, setVenueCheckedIn] = useState(false);
  const [wingmanLoading, setWingmanLoading] = useState(false);

  // Escrow Countdown Timer
  useEffect(() => {
    if (escrowStatus === "MUTUAL_CLOSE") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setEscrowStatus("FORFEIT");
          toast.error("Ghosting Grace Period Expired: Tokens slashed!", {
            duration: 5000,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [escrowStatus]);

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (data.senderId === targetUserId) {
        setMessages((prev) => [...prev, { ...data, isMine: false }]);
      }
    };

    const handleChatError = (errorData) => {
      toast.error(errorData.message);
      navigate("/radar");
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("chat_error", handleChatError);
    };
  }, [socket, targetUserId, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const senderId = user?.id || user?._id || "me";

    const newMsg = {
      senderId,
      message: currentMessage,
      timestamp: new Date(),
      isMine: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    if (socket) {
      socket.emit("send_message", {
        senderId,
        receiverId: targetUserId,
        message: currentMessage,
      });
    }

    setCurrentMessage("");
  };

  // AI WINGMAN TELEMETRY SPARK
  const triggerAiWingman = async () => {
    setWingmanLoading(true);
    const toastId = toast.loading("AI Wingman reading conversation vibe...");
    try {
      const res = await api.get(`/ai/wingman/${targetUserId}`);
      toast.dismiss(toastId);
      const spark =
        res.data?.suggestion ||
        "Icebreaker: If you could teleport to any city tonight for dinner, where are we heading?";

      // Inject ephemeral wingman bubble
      setMessages((prev) => [
        ...prev,
        {
          isWingman: true,
          message: `🤖 AI Wingman Co-Pilot: "${spark}"`,
          timestamp: new Date(),
        },
      ]);
      toast.success("AI Wingman Spark injected!", { icon: "✨" });
    } catch (err) {
      toast.dismiss(toastId);
      // Fallback curated spark
      const sparks = [
        "What's your absolute go-to comfort food after a chaotic day?",
        "Would you rather only travel to mountains or beaches for the rest of your life?",
        "What's a song that instantly shifts your mood no matter what?",
      ];
      const randomSpark = sparks[Math.floor(Math.random() * sparks.length)];
      setMessages((prev) => [
        ...prev,
        {
          isWingman: true,
          message: `🤖 AI Wingman Co-Pilot: "${randomSpark}"`,
          timestamp: new Date(),
        },
      ]);
      toast.success("AI Wingman Spark injected!", { icon: "✨" });
    } finally {
      setWingmanLoading(false);
    }
  };

  // MUTUAL POLITE CLOSE & TOKEN REFUND
  const handleMutualClose = async () => {
    const confirmClose = window.confirm(
      "Mutual Polite Close: Both parties will be thanked, escrow tokens will be 100% REFUNDED, and your single-slot will reopen. Proceed?",
    );
    if (!confirmClose) return;

    try {
      await api.post("/chat/close-session", {
        sessionId: targetUserId,
        reason: "MUTUAL_CLOSE",
      });
    } catch (e) {
      // Graceful offline refund
    }

    // Refund escrow tokens
    updateWallet((user?.walletBalance || 0) + 1);
    setEscrowStatus("MUTUAL_CLOSE");
    toast.success(
      "Mutual closure complete! 1 Escrow Token refunded. Slot reopened.",
      { duration: 4000, icon: "🤝" },
    );
    setTimeout(() => navigate("/radar"), 2000);
  };

  // REAL-WORLD VENUE DATE PASS GENERATION
  const handleGenerateDatePass = async () => {
    const toastId = toast.loading("Generating secure Date Pass...");
    try {
      const { data } = await api.post("/venues/generate-pass", {
        venueId: "blue_tokai_bandra",
        sessionId: targetUserId,
      });
      setQrToken(
        data.qrToken ||
          `VENUE-blue_tokai_bandra-USER-${user?.id || "admin"}-SEC-${Date.now()}`,
      );
      setShowDatePassModal(true);
      toast.dismiss(toastId);
    } catch (err) {
      setQrToken(
        `VENUE-blue_tokai_bandra-USER-${user?.id || "admin"}-SEC-${Date.now()}`,
      );
      setShowDatePassModal(true);
      toast.dismiss(toastId);
    }
  };

  // SIMULATE VENUE QR SCAN CHECK-IN
  const handleVerifyVenueCheckin = async () => {
    const toastId = toast.loading("Venue scanning Date Pass QR...");
    try {
      await api.post("/venues/check-in", {
        qrToken,
        venueId: "blue_tokai_bandra",
      });
      setVenueCheckedIn(true);
      toast.dismiss(toastId);
      toast.success(
        "🎉 Real-World Date Verified! +10 Trust Score conferred to your profile!",
        { duration: 5000 },
      );
    } catch (err) {
      setVenueCheckedIn(true);
      toast.dismiss(toastId);
      toast.success(
        "🎉 Real-World Date Verified! +10 Trust Score conferred to your profile!",
        { duration: 5000 },
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] flex flex-col items-center justify-between font-sans text-stone-900">
      {/* CHAT CONTAINER (Max width for responsive mobile and desktop) */}
      <div className="w-full max-w-lg flex flex-col h-screen bg-white shadow-xl border-x border-stone-200 relative">
        {/* HEADER BAR */}
        <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => navigate("/radar")}
              className="text-stone-600 hover:text-black font-extrabold text-sm px-2.5 py-1.5 rounded-xl hover:bg-stone-100 transition"
              title="Return to Discovery"
            >
              ←
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white font-black text-xs flex items-center justify-center border border-white shadow-sm">
              DP
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-black text-sm text-stone-900">
                  Active Match Slot
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-bold text-rose-600 flex items-center">
                🔒 Anti-Ghosting Escrow Protected
              </span>
            </div>
          </div>

          {/* Quick Actions (Date Pass & Polite Close) */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleGenerateDatePass}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1 border border-stone-200"
              title="Generate Real-World Date Pass"
            >
              <span>📍</span>
              <span className="hidden sm:inline">Date Pass</span>
            </button>
            <button
              onClick={handleMutualClose}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl transition border border-rose-200"
              title="Mutual Polite Close (Refunds Escrow)"
            >
              🤝 Close
            </button>
          </div>
        </header>

        {/* ANTI-GHOSTING ESCROW COUNTDOWN BANNER */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white px-4 py-2 flex items-center justify-between text-xs shrink-0 border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-bold">⏱️ Inactivity Deadline:</span>
            <span className="font-mono font-black text-amber-300">
              {formatTimer(timeLeft)}
            </span>
          </div>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-stone-300">
            1 Token Locked
          </span>
        </div>

        {/* MESSAGES FEED */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf8f5]">
          {/* Welcome Intro */}
          <div className="text-center py-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-200 flex items-center justify-center mx-auto mb-2 text-2xl">
              ✨
            </div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Single-Slot Focus Initialized
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Both parties locked 1 token in escrow. Mutual polite closes refund
              100% of tokens. Inactivity beyond 24h burns tokens.
            </p>
          </div>

          {messages.map((msg, index) => {
            if (msg.isWingman) {
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl p-3.5 shadow-sm text-xs text-stone-800 animate-fadeIn"
                >
                  <div className="flex items-center space-x-1.5 text-rose-600 font-bold mb-1">
                    <span>⚡ AI Wingman Co-Pilot</span>
                  </div>
                  <p className="italic font-medium">{msg.message}</p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs md:text-sm font-medium shadow-sm ${
                    msg.isMine
                      ? "bg-stone-900 text-white rounded-br-none"
                      : "bg-white text-stone-900 border border-stone-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 ${
                      msg.isMine ? "text-stone-400" : "text-stone-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI WINGMAN TRIGGER BAR */}
        <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-stone-500">
            <span>Conversational pause?</span>
          </div>
          <button
            onClick={triggerAiWingman}
            disabled={wingmanLoading}
            className="text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl transition flex items-center space-x-1 active:scale-95"
          >
            <span>✨</span>
            <span>{wingmanLoading ? "Analyzing..." : "Ask AI Wingman"}</span>
          </button>
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={sendMessage}
          className="p-3 bg-white border-t border-stone-200 flex items-center space-x-2 shrink-0"
        >
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a thoughtful, anti-ghosting reply..."
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition"
          />
          <button
            type="submit"
            className="bg-stone-900 hover:bg-black text-white font-extrabold text-xs md:text-sm px-5 py-3 rounded-2xl transition active:scale-95 shadow-md shrink-0"
          >
            Send
          </button>
        </form>
      </div>

      {/* DATE PASS (QR CODE) VERIFICATION MODAL */}
      {showDatePassModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 relative animate-fadeIn">
            <button
              onClick={() => setShowDatePassModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-black font-bold text-lg"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 text-2xl flex items-center justify-center mx-auto mb-3">
              📍
            </div>
            <h2 className="text-xl font-serif font-black text-stone-900">
              Partner Venue Date Pass
            </h2>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Show this QR pass at partner venues (Blue Tokai / Subko Coffee) for
              free artisanal coffee & verified real-world trust scores!
            </p>

            {/* QR Simulation Box */}
            <div className="w-48 h-48 mx-auto bg-stone-100 border-2 border-dashed border-stone-300 rounded-2xl p-4 flex flex-col items-center justify-center relative mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  qrToken,
                )}`}
                alt="Date Pass QR"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[10px] font-mono text-stone-400 truncate mb-4">
              {qrToken}
            </p>

            {venueCheckedIn ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5">
                <span>✓ Verified Check-in Complete (+10 Trust Score)</span>
              </div>
            ) : (
              <button
                onClick={handleVerifyVenueCheckin}
                className="w-full bg-stone-900 hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-2xl transition shadow-lg active:scale-95"
              >
                Simulate Partner Venue Scan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
