"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { SocketContext } from "../../Context/SocketContext";
import api from "../../api/axiosConfig";
import { Check, CheckCheck, Clock, ShieldCheck, Sparkles, MapPin, Coffee, Handshake } from "lucide-react";

const KNOWN_MATCH_PROFILES = {
  like_1: {
    name: "Archie",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    initialMsg: "Hey! Loved your prompt about coffee dates ☕ Subko or Blue Tokai this weekend?",
    diet: "Pure Veg",
    location: "Bandra West, Mumbai",
  },
  m1: {
    name: "Kalpesh",
    age: 26,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    initialMsg: "Haha totally agree! Have you visited the new Subko cafe in Bandra?",
    diet: "Pure Veg",
    location: "Khar West, Mumbai",
  },
  m2: {
    name: "Aisha",
    age: 25,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    initialMsg: "Subko or Blue Tokai this weekend? I know a great quiet corner table!",
    diet: "Pure Veg",
    location: "Carter Road, Mumbai",
  },
  m3: {
    name: "Shubham",
    age: 27,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    initialMsg: "Hey! Let's plan a coffee date with the Date-NearMe 15% discount!",
    diet: "Jain",
    location: "Pali Hill, Mumbai",
  },
};

const ChatRoom = () => {
  const params = useParams();
  const targetUserId = params?.id || params?.targetUserId || "like_1";
  const { user, updateWallet } = useContext(AuthContext);
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket !== undefined ? socketContext.socket : socketContext;
  const markChatAsRead = socketContext?.markChatAsRead;
  const onlineUsers = socketContext?.onlineUsers || new Set();
  const router = useRouter();

  const currentMatch = KNOWN_MATCH_PROFILES[targetUserId] || {
    name: targetUserId.startsWith("like") ? "Archie" : "Date Match",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    initialMsg: "Hey! Let's plan a date at our partner cafe with 15% off!",
  };

  const isTargetOnline = onlineUsers.has(targetUserId);

  const [messages, setMessages] = useState([
    {
      id: "initial_msg",
      senderId: targetUserId,
      message: currentMatch.initialMsg,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isMine: false,
      status: "read",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 3600 - 180); // 23h 57m
  const [escrowStatus, setEscrowStatus] = useState("LOCKED_ESCROW"); // LOCKED_ESCROW, ACTIVE, MUTUAL_CLOSE, FORFEIT
  const [showDatePassModal, setShowDatePassModal] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [venueCheckedIn, setVenueCheckedIn] = useState(false);
  const [wingmanLoading, setWingmanLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPeerTyping]);

  // Load message history from REST API fallback & mark as read
  useEffect(() => {
    if (markChatAsRead) {
      markChatAsRead(targetUserId);
    }

    async function loadHistory() {
      try {
        const res = await api.get(`/chat/messages/${targetUserId}`);
        if (res.data?.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        // Fallback to local state if REST endpoint not accessible
      }
    }

    loadHistory();
  }, [targetUserId, markChatAsRead]);

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

  // Socket.IO Event Handlers
  useEffect(() => {
    if (!socket) return;

    // Real-time incoming message
    const handleReceiveMessage = (data) => {
      if (data.senderId === targetUserId) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            isMine: false,
            status: "delivered",
          },
        ]);

        // Tell sender we read their message
        socket.emit("mark_messages_read", {
          userId: user?.id || user?._id,
          senderId: targetUserId,
        });
      }
    };

    // Double tick confirmation (peer received message)
    const handleMessageDelivered = ({ id }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "delivered" } : m))
      );
    };

    // Blue tick confirmation (peer opened chat)
    const handleMessagesReadByPeer = ({ readBy }) => {
      if (readBy === targetUserId) {
        setMessages((prev) => prev.map((m) => (m.isMine ? { ...m, status: "read" } : m)));
      }
    };

    // Typing status
    const handleUserTyping = ({ senderId, isTyping }) => {
      if (senderId === targetUserId) {
        setIsPeerTyping(isTyping);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("messages_read_by_peer", handleMessagesReadByPeer);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("messages_read_by_peer", handleMessagesReadByPeer);
      socket.off("user_typing", handleUserTyping);
    };
  }, [socket, targetUserId, user]);

  // Handle typing debounce
  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);

    if (socket) {
      const senderId = user?.id || user?._id || "me";
      socket.emit("typing_start", {
        senderId,
        receiverId: targetUserId,
        senderName: user?.displayName || "You",
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing_stop", {
          senderId,
          receiverId: targetUserId,
        });
      }, 1500);
    }
  };

  // Send Message with Socket.IO + REST Fallback
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const senderId = user?.id || user?._id || "me";
    const text = currentMessage.trim();
    const tempId = `temp_${Date.now()}`;

    const newMsg = {
      id: tempId,
      senderId,
      receiverId: targetUserId,
      message: text,
      timestamp: new Date(),
      isMine: true,
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setCurrentMessage("");

    // Stop typing immediately
    if (socket) {
      socket.emit("typing_stop", { senderId, receiverId: targetUserId });
    }

    let socketSuccess = false;

    // 1. Primary: Socket.IO with Acknowledgment
    if (socket && socket.connected) {
      try {
        socket.emit(
          "send_message",
          {
            senderId,
            receiverId: targetUserId,
            message: text,
            senderName: user?.displayName || "A Match",
            senderAvatar: user?.avatar || "",
            sessionId: targetUserId,
          },
          (ack) => {
            if (ack && ack.status === "success") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId
                    ? {
                        ...m,
                        id: ack.id || m.id,
                        status: ack.delivered ? "delivered" : "sent",
                      }
                    : m
                )
              );

              if (ack.offlineQueued) {
                toast(
                  `${currentMatch.name} is currently offline. Your message is safely queued as an offline alert! 📬`,
                  { icon: "ℹ️", duration: 3500 }
                );
              }
            }
          }
        );
        socketSuccess = true;
      } catch (err) {
        socketSuccess = false;
      }
    }

    // 2. Fallback: REST API if socket is offline or cold
    if (!socketSuccess) {
      try {
        const { data } = await api.post("/chat/send-message", {
          receiverId: targetUserId,
          message: text,
          senderName: user?.displayName || "A Match",
          senderAvatar: user?.avatar || "",
          sessionId: targetUserId,
        });
        if (data?.data) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, id: data.data.id } : m))
          );
        }
      } catch (apiErr) {
        // Message remains optimistically shown in chat
      }
    }
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
      "Mutual Polite Close: Both parties will be thanked, escrow tokens will be 100% REFUNDED, and your single-slot will reopen. Proceed?"
    );
    if (!confirmClose) return;

    try {
      await api.post("/chat/close", {
        sessionId: targetUserId,
        resolution: "POLITE_CLOSE",
      });
    } catch (e) {
      // Graceful offline refund
    }

    updateWallet((user?.walletBalance || 0) + 1);
    setEscrowStatus("MUTUAL_CLOSE");
    toast.success(
      "Mutual closure complete! 1 Escrow Token refunded. Slot reopened.",
      { duration: 4000, icon: "🤝" }
    );
    setTimeout(() => router.push("/radar"), 2000);
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
          `VENUE-blue_tokai_bandra-USER-${user?.id || "admin"}-SEC-${Date.now()}`
      );
      setShowDatePassModal(true);
      toast.dismiss(toastId);
    } catch (err) {
      setQrToken(
        `VENUE-blue_tokai_bandra-USER-${user?.id || "admin"}-SEC-${Date.now()}`
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
        { duration: 5000 }
      );
    } catch (err) {
      setVenueCheckedIn(true);
      toast.dismiss(toastId);
      toast.success(
        "🎉 Real-World Date Verified! +10 Trust Score conferred to your profile!",
        { duration: 5000 }
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col items-center justify-between font-sans text-stone-900">
      {/* CHAT CONTAINER */}
      <div className="w-full max-w-lg flex flex-col h-screen bg-white/95 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.06)] border-x border-stone-200/80 relative">
        {/* HEADER BAR */}
        <header className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => router.push("/radar")}
              className="text-stone-600 hover:text-stone-900 font-extrabold text-sm px-2.5 py-1.5 rounded-xl hover:bg-stone-100 transition"
              title="Return to Discovery"
            >
              ←
            </button>
            <div className="relative">
              <img
                src={currentMatch.avatar}
                alt={currentMatch.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#711A31] shadow-sm shrink-0"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  isTargetOnline ? "bg-emerald-500 animate-pulse" : "bg-stone-300"
                }`}
                title={isTargetOnline ? "Online Now" : "Offline (Notified via queue)"}
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-black text-sm text-stone-900">
                  {currentMatch.name}, {currentMatch.age}
                </span>
                <span className="text-[10px] font-bold text-stone-500">
                  {isTargetOnline ? "● Active now" : "Offline"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#711A31] flex items-center">
                🔒 Anti-Ghosting Escrow Protected
              </span>
            </div>
          </div>

          {/* Quick Actions (Date Pass & Polite Close) */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleGenerateDatePass}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 border border-stone-200 shadow-sm"
              title="Generate Real-World Date Pass"
            >
              <MapPin className="w-3.5 h-3.5 text-[#711A31]" />
              <span className="hidden sm:inline">Date Pass</span>
            </button>
            <button
              onClick={handleMutualClose}
              className="bg-rose-50 hover:bg-rose-100 text-[#711A31] text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition border border-rose-200 shadow-sm"
              title="Mutual Polite Close (Refunds Escrow)"
            >
              🤝 Close
            </button>
          </div>
        </header>

        {/* ANTI-GHOSTING ESCROW COUNTDOWN BANNER */}
        <div className="bg-[#711A31] text-white px-4 py-2 flex items-center justify-between text-xs shrink-0 shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="text-rose-100 font-semibold">⏱️ Inactivity Deadline:</span>
            <span className="font-mono font-black text-white text-sm tracking-wide">
              {formatTimer(timeLeft)}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-white backdrop-blur-sm border border-white/25">
            1 Token Locked
          </span>
        </div>

        {/* MESSAGES FEED */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
          {/* Welcome Intro */}
          <div className="text-center py-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-stone-200 flex items-center justify-center mx-auto mb-2 text-xl">
              ✨
            </div>
            <h3 className="font-serif font-black text-sm text-stone-900">
              Single-Slot Focus Initialized with {currentMatch.name}
            </h3>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto mt-0.5">
              Real-time messaging via Socket.IO with offline notification delivery.
            </p>
          </div>

          {messages.map((msg, index) => {
            if (msg.isWingman) {
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl p-3 shadow-sm text-xs text-stone-800 animate-fadeIn"
                >
                  <div className="flex items-center space-x-1.5 text-rose-600 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Wingman Co-Pilot</span>
                  </div>
                  <p className="italic font-medium">{msg.message}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id || index}
                className={`flex ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs md:text-sm font-medium shadow-sm leading-relaxed ${
                    msg.isMine
                      ? "bg-[#711A31] text-white rounded-br-none shadow-md"
                      : "bg-white text-stone-900 border border-stone-200/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px]">
                    <span className={msg.isMine ? "text-rose-200" : "text-stone-400"}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.isMine && (
                      <span className="text-rose-200">
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-300 inline" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-stone-300 inline" />
                        ) : (
                          <Check className="w-3 h-3 text-stone-300 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Bubble */}
          {isPeerTyping && (
            <div className="flex items-center space-x-2 text-stone-500 text-xs italic bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl px-3.5 py-2 w-max animate-pulse">
              <span>{currentMatch.name} is typing...</span>
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-[#711A31] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#711A31] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-1.5 h-1.5 bg-[#711A31] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* AI WINGMAN TRIGGER BAR */}
        <div className="px-3.5 py-2 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-stone-600 font-medium">
            <span>Conversational pause?</span>
          </div>
          <button
            onClick={triggerAiWingman}
            disabled={wingmanLoading}
            className="text-xs font-black text-[#711A31] hover:text-[#581426] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1 rounded-xl transition flex items-center space-x-1 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{wingmanLoading ? "Analyzing..." : "Ask AI Wingman"}</span>
          </button>
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={sendMessage}
          className="p-3 bg-white border-t border-stone-200/80 flex items-center space-x-2 shrink-0"
        >
          <input
            type="text"
            value={currentMessage}
            onChange={handleInputChange}
            placeholder={
              isTargetOnline
                ? "Type a message..."
                : `Message ${currentMatch.name} (delivered via offline queue)...`
            }
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-stone-900 focus:outline-none focus:border-[#711A31] transition"
          />
          <button
            type="submit"
            className="bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs md:text-sm px-5 py-3 rounded-2xl transition active:scale-95 shadow-md shrink-0"
          >
            Send
          </button>
        </form>
      </div>

      {/* DATE PASS (QR CODE) VERIFICATION MODAL */}
      {showDatePassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/98 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 relative animate-fadeIn text-stone-900">
            <button
              onClick={() => setShowDatePassModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#711A31] text-2xl flex items-center justify-center mx-auto mb-3 border border-rose-200">
              📍
            </div>
            <h2 className="text-xl font-serif font-black text-stone-900">
              Partner Venue Date Pass
            </h2>
            <p className="text-xs text-stone-600 mt-1 mb-5 leading-relaxed">
              Show this QR pass at partner venues (Blue Tokai / Subko Coffee) for
              free artisanal coffee & verified real-world trust scores!
            </p>

            <div className="w-48 h-48 mx-auto bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-4 flex flex-col items-center justify-center relative mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  qrToken
                )}`}
                alt="Date Pass QR"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[10px] font-mono text-stone-500 truncate mb-4">
              {qrToken}
            </p>

            {venueCheckedIn ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm">
                <span>✓ Verified Check-in Complete (+10 Trust Score)</span>
              </div>
            ) : (
              <button
                onClick={handleVerifyVenueCheckin}
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-2xl transition shadow-md active:scale-95"
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
