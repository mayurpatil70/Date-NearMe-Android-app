"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MapPin,
  Coffee,
  Heart,
  MessageCircle,
  Navigation,
  Compass,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  X,
  Share2,
} from "lucide-react";

// Default Anchor: Bandra West, Mumbai (matching Screenshot 1 & partner venues)
const DEFAULT_CENTER = [19.0596, 72.8295];

export const NEARBY_ACTIVE_USERS = [
  {
    id: "user_archie",
    name: "Archie",
    age: 24,
    gender: "Woman",
    pronouns: "she/her",
    profession: "Lead UX Designer @ Creative Studio",
    education: "NIFT Mumbai",
    height: "5'6\"",
    zodiac: "Gemini ♊",
    diet: "Pure Veg",
    intent: "Dating for Marriage (1-2 Years)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    lat: 19.0596,
    lng: 72.8295,
    distanceKm: 0.4,
    neighborhood: "Bandra West, Mumbai",
    activeStatus: "Active 2m ago",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Golden Retriever Mom 🐾 planning to live independently",
    vibeAudioNote: "15s voice note on favorite coffee spots",
  },
  {
    id: "user_kalpesh",
    name: "Kalpesh",
    age: 26,
    gender: "Man",
    pronouns: "he/him",
    profession: "Senior Frontend Architect",
    education: "VJTI Mumbai",
    height: "5'11\"",
    zodiac: "Leo ♌",
    diet: "Eggetarian",
    intent: "Long-term Relationship",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    lat: 19.0680,
    lng: 72.8340,
    distanceKm: 1.1,
    neighborhood: "Khar West, Mumbai",
    activeStatus: "Active now",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Subko pour-over vs Blue Tokai aero-press debate anytime!",
    vibeAudioNote: "Indie rock acoustic riff",
  },
  {
    id: "user_shubham",
    name: "Shubham",
    age: 27,
    gender: "Man",
    pronouns: "he/him",
    profession: "FinTech Product Manager",
    education: "NMIMS Mumbai",
    height: "5'10\"",
    zodiac: "Libra ♎",
    diet: "Jain",
    intent: "Dating with Marriage Intent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    lat: 19.0630,
    lng: 72.8360,
    distanceKm: 0.8,
    neighborhood: "Pali Hill, Mumbai",
    activeStatus: "Active 5m ago",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Strictly Jain food explorer. Looking for weekend farmers market buddy.",
    vibeAudioNote: "Coffee brewing morning podcast",
  },
  {
    id: "user_aisha",
    name: "Aisha",
    age: 25,
    gender: "Woman",
    pronouns: "she/her",
    profession: "Contemporary Art Curator",
    education: "Sir J.J. School of Art",
    height: "5'5\"",
    zodiac: "Taurus ♉",
    diet: "Pure Veg",
    intent: "Intentional Dating",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    lat: 19.0620,
    lng: 72.8210,
    distanceKm: 1.3,
    neighborhood: "Carter Road, Mumbai",
    activeStatus: "Active now",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Sunset strolls down Carter Road and discovering hole-in-the-wall bookstores.",
    vibeAudioNote: "Sea breeze playlist",
  },
  {
    id: "user_mayur",
    name: "Mayur",
    age: 28,
    gender: "Man",
    pronouns: "he/him",
    profession: "Creative Director",
    education: "Symbiosis Pune",
    height: "6'0\"",
    zodiac: "Aries ♈",
    diet: "Eggetarian",
    intent: "Dating for Life Partner",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    lat: 19.0480,
    lng: 72.8180,
    distanceKm: 1.6,
    neighborhood: "Bandra Bandstand, Mumbai",
    activeStatus: "Active 1m ago",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Weekend motorcycle road trips and analog vinyl collecting.",
    vibeAudioNote: "Retro jazz records",
  },
  {
    id: "user_priya",
    name: "Priya",
    age: 24,
    gender: "Woman",
    pronouns: "she/her",
    profession: "Documentary Photographer",
    education: "St. Xavier's Mumbai",
    height: "5'4\"",
    zodiac: "Sagittarius ♐",
    diet: "Pure Veg",
    intent: "Intentional Dating",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    lat: 19.0550,
    lng: 72.8350,
    distanceKm: 0.9,
    neighborhood: "Linking Road, Mumbai",
    activeStatus: "Active now",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Always ready for spicy cutting chai and deep conversations on world cinema.",
    vibeAudioNote: "Monsoon rains in Mumbai soundscape",
  },
  {
    id: "user_kabir",
    name: "Kabir",
    age: 27,
    gender: "Man",
    pronouns: "he/him",
    profession: "Electronic Music Producer",
    education: "Whistling Woods",
    height: "5'9\"",
    zodiac: "Scorpio ♏",
    diet: "Jain",
    intent: "Dating for Marriage",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    lat: 19.0670,
    lng: 72.8680,
    distanceKm: 2.4,
    neighborhood: "BKC, Mumbai",
    activeStatus: "Active now",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Synthesizers, specialty matcha, and long drives on Sea Link.",
    vibeAudioNote: "Lo-fi sunset beat",
  },
  {
    id: "user_ananya",
    name: "Ananya",
    age: 25,
    gender: "Woman",
    pronouns: "she/her",
    profession: "Interior & Spatial Designer",
    education: "Rizvi College of Architecture",
    height: "5'7\"",
    zodiac: "Pisces ♓",
    diet: "Pure Veg",
    intent: "Dating for Marriage (1-2 Years)",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    lat: 19.0810,
    lng: 72.8360,
    distanceKm: 2.1,
    neighborhood: "Santacruz West, Mumbai",
    activeStatus: "Active 8m ago",
    isOnline: true,
    isShieldVerified: true,
    prompt: "Designing cozy living spaces, baking sourdough, and Sunday runs.",
    vibeAudioNote: "Sourdough crackle morning audio",
  },
];

export const PARTNER_CAFES = [
  {
    id: "cafe_subko",
    name: "Subko Specialty Coffee Roasters",
    tagline: "Artisanal Breads, Specialty Roasts & Intimate Date Atmosphere",
    address: "Perry Cross Road, Bandra West, Mumbai 400050",
    distanceKm: 0.5,
    lat: 19.0560,
    lng: 72.8270,
    rating: 4.9,
    reviews: 1420,
    discountOffer: "15% OFF Total Bill + 2 Free Sourdough Chocolate Cookies",
    partnerPerk: "Verified Date-NearMe Safe Zone with table priority",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    vibe: "Warm Woody, Soft Jazz, High Aesthetic",
    avgCost: "₹750 for two",
  },
  {
    id: "cafe_blue_tokai",
    name: "Blue Tokai Coffee Roasters",
    tagline: "Quiet Conversations, Garden Patio & Specialty Single-Origin Brews",
    address: "Pali Mala Road, Off Pali Hill, Bandra West, Mumbai 400050",
    distanceKm: 0.7,
    lat: 19.0645,
    lng: 72.8310,
    rating: 4.8,
    reviews: 980,
    discountOffer: "10% OFF Date Pass + Complimentary Pour-over Coffee Tasting",
    partnerPerk: "Dedicated 'Date-NearMe' Quiet Corner Table reservation",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    vibe: "Intimate, Courtyard Seating, Pet Friendly",
    avgCost: "₹650 for two",
  },
  {
    id: "cafe_grounded",
    name: "Grounded Cafe & Bistro",
    tagline: "Romantic Al Fresco Courtyard, Mediterranean Light Bites & Sourdough",
    address: "14th Road, Khar West, Mumbai 400052",
    distanceKm: 1.2,
    lat: 19.0520,
    lng: 72.8290,
    rating: 4.9,
    reviews: 640,
    discountOffer: "Free Artisanal Basque Cheesecake on your First Date",
    partnerPerk: "Complimentary signature date dessert with QR pass",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
    vibe: "Bohemian Chic, Fairy Lights, Romantic",
    avgCost: "₹900 for two",
  },
  {
    id: "cafe_bagel_shop",
    name: "The Bagel Shop",
    tagline: "Vintage Bandra Bungalow, Leafy Courtyard & Hearty Breakfast Dates",
    address: "No. 30, Pali Mala Road, Bandra West, Mumbai 400050",
    distanceKm: 0.9,
    lat: 19.0620,
    lng: 72.8240,
    rating: 4.7,
    reviews: 890,
    discountOffer: "15% OFF Couple Brunch Set + Free Cold Brew",
    partnerPerk: "Cozy conversational lounge seating with board games",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    vibe: "Laidback, Leafy Green, Conversational",
    avgCost: "₹700 for two",
  },
  {
    id: "cafe_doolally",
    name: "Doolally Date Lounge & Taproom",
    tagline: "Fun Board Games, Craft Drinks & Icebreaker Friendly Vibe",
    address: "Near Khar Tele Exchange, Khar West, Mumbai 400052",
    distanceKm: 1.5,
    lat: 19.0710,
    lng: 72.8340,
    rating: 4.8,
    reviews: 1150,
    discountOffer: "20% OFF Date-Night Combos & Complimentary Fries",
    partnerPerk: "Free couple trivia kit & icebreaker conversation cards",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    vibe: "Upbeat, Games, Casual Evening Date",
    avgCost: "₹1,200 for two",
  },
];

export default function LiveDatingMap({ onSelectMatchForChat }) {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'people' | 'cafes' | 'pure_veg' | 'jain'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [viewMode, setViewMode] = useState("map"); // 'map' | 'list'
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [wavingUserId, setWavingUserId] = useState(null);
  const [invitedMatchId, setInvitedMatchId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(null); // { user, cafe }

  // Filtered collections
  const filteredUsers = NEARBY_ACTIVE_USERS.filter((u) => {
    if (activeFilter === "cafes") return false;
    if (activeFilter === "pure_veg" && u.diet !== "Pure Veg") return false;
    if (activeFilter === "jain" && u.diet !== "Jain") return false;
    return true;
  });

  const filteredCafes = PARTNER_CAFES.filter(() => {
    if (activeFilter === "people" || activeFilter === "jain") return false;
    return true;
  });

  // Initialize Leaflet Map safely client-side
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import("leaflet")).default;

        if (!mapContainerRef.current) return;

        // Clean up previous instance if any
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        // Initialize map
        const map = L.map(mapContainerRef.current, {
          center: userLocation,
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        // Add custom light CartoDB tiles (clean, high-end, free) with OSM fallback
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            subdomains: "abcd",
          }
        ).addTo(map);

        // Zoom control in bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Layer group for dynamic markers
        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        leafletMapRef.current = map;

        if (isMounted) {
          setMapLoaded(true);
        }
      } catch (err) {
        console.error("Leaflet initialization error:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Sync Markers whenever filter or selection changes
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const layer = markersLayerRef.current;
      layer.clearLayers();

      // 1. Current User Pin
      const userDotHtml = `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full bg-[#711A31]/20 animate-ping"></div>
          <div class="relative w-4 h-4 rounded-full bg-[#711A31] border-2 border-white shadow-md"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: userDotHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker(userLocation, { icon: userIcon }).addTo(layer);

      // 2. Active Nearby Users Markers
      filteredUsers.forEach((u) => {
        const isSelected = selectedUser?.id === u.id;
        const userHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 ${
            isSelected ? "scale-110 z-30" : "z-10"
          }">
            <div class="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#711A31] via-[#E11D48] to-amber-400 shadow-xl">
              <img src="${u.avatar}" alt="${u.name}" class="w-full h-full object-cover rounded-full border-2 border-white" />
              <div class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </div>
            </div>
            <div class="mt-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md border border-stone-200/80 flex items-center space-x-1">
              <span class="text-[10px] font-black text-stone-900">${u.name}</span>
              <span class="text-[9px] text-[#711A31] font-bold">${u.distanceKm}km</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: "custom-radar-marker",
          html: userHtml,
          iconSize: [48, 64],
          iconAnchor: [24, 48],
        });

        const marker = L.marker([u.lat, u.lng], { icon });
        marker.on("click", () => {
          setSelectedCafe(null);
          setSelectedUser(u);
          leafletMapRef.current?.panTo([u.lat, u.lng], { animate: true, duration: 0.5 });
        });
        marker.addTo(layer);
      });

      // 3. Partner Cafes Markers
      filteredCafes.forEach((c) => {
        const isSelected = selectedCafe?.id === c.id;
        const cafeHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 ${
            isSelected ? "scale-110 z-30" : "z-20"
          }">
            <div class="relative w-11 h-11 rounded-2xl bg-[#711A31] text-white flex items-center justify-center shadow-xl border-2 border-amber-300">
              <span class="text-lg">☕</span>
              <div class="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-sm">
                15% OFF
              </div>
            </div>
            <div class="mt-1 bg-stone-900 text-amber-200 px-2 py-0.5 rounded-full shadow-md text-[9px] font-extrabold truncate max-w-[90px] border border-amber-400/40">
              ${c.name.split(" ")[0]}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: "custom-cafe-marker",
          html: cafeHtml,
          iconSize: [44, 60],
          iconAnchor: [22, 44],
        });

        const marker = L.marker([c.lat, c.lng], { icon });
        marker.on("click", () => {
          setSelectedUser(null);
          setSelectedCafe(c);
          leafletMapRef.current?.panTo([c.lat, c.lng], { animate: true, duration: 0.5 });
        });
        marker.addTo(layer);
      });
    }

    updateMarkers();
  }, [filteredUsers, filteredCafes, selectedUser, selectedCafe, userLocation]);

  // Recenter map to GPS or default
  const handleLocateMe = () => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      const toastId = toast.loading("Locating nearby people...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(newLoc);
          leafletMapRef.current?.setView(newLoc, 14, { animate: true });
          toast.success("Location Synced! Showing nearby active daters.", { id: toastId });
        },
        () => {
          setUserLocation(DEFAULT_CENTER);
          leafletMapRef.current?.setView(DEFAULT_CENTER, 14, { animate: true });
          toast.success("Defaulting to Bandra West, Mumbai hotspot.", { id: toastId });
        },
        { timeout: 5000 }
      );
    } else {
      leafletMapRef.current?.setView(DEFAULT_CENTER, 14, { animate: true });
      toast("Centered on Bandra West hotspot", { icon: "📍" });
    }
  };

  // Wave / Say Hi interaction
  const handleWaveAtUser = (targetUser) => {
    setWavingUserId(targetUser.id);
    toast.success(`You waved at ${targetUser.name}! If they wave back, a single-slot chat opens. 👋`, {
      duration: 4000,
      icon: "✨",
    });
    setTimeout(() => setWavingUserId(null), 2500);
  };

  // Instant Single-Slot Chat Start
  const handleStartChatWithUser = (targetUser) => {
    if (onSelectMatchForChat) {
      onSelectMatchForChat(targetUser);
    } else {
      router.push(`/chat/${targetUser.id}`);
    }
  };

  // Open Google Maps free turn-by-turn directions
  const handleOpenGoogleMapsDirections = (lat, lng, queryName) => {
    const encoded = encodeURIComponent(queryName || `${lat},${lng}`);
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encoded}`;
    window.open(gmapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col items-center relative min-h-screen pb-32">
      {/* TOP HEADER CONTROLS (Floating Glass Capsule) */}
      <div className="w-full max-w-4xl px-3 sm:px-4 pt-3 z-30 sticky top-1">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.06)] flex flex-col gap-2.5">
          {/* Status & Live Counter Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-2xl bg-rose-50 text-[#711A31] flex items-center justify-center font-bold text-sm shadow-sm border border-rose-100">
                <Compass className="w-4 h-4 text-[#711A31] animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-black text-sm text-stone-900 tracking-tight">
                    Live Dating Radar
                  </span>
                  <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{filteredUsers.length} active nearby</span>
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  Bandra West • {filteredCafes.length} Partner Cafes with 15% Date Pass
                </p>
              </div>
            </div>

            {/* Quick Actions (Locate & View Toggle) */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleLocateMe}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 p-2 rounded-2xl transition border border-stone-200 text-xs flex items-center space-x-1 shadow-sm"
                title="Locate My Position"
              >
                <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                <span className="hidden sm:inline text-[11px] font-bold">Locate Me</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                className="bg-[#711A31] text-white hover:bg-[#581426] px-3 py-2 rounded-2xl transition font-bold text-[11px] flex items-center space-x-1 shadow-sm active:scale-95"
              >
                <span>{viewMode === "map" ? "📋 List View" : "🗺️ Map View"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide pt-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 ${
                activeFilter === "all"
                  ? "bg-[#711A31] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All Nearby ({NEARBY_ACTIVE_USERS.length + PARTNER_CAFES.length})
            </button>
            <button
              onClick={() => setActiveFilter("people")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 flex items-center space-x-1 ${
                activeFilter === "people"
                  ? "bg-[#711A31] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>🟢 Active People ({NEARBY_ACTIVE_USERS.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("cafes")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 flex items-center space-x-1 ${
                activeFilter === "cafes"
                  ? "bg-[#711A31] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>☕ Partner Cafes ({PARTNER_CAFES.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("pure_veg")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 ${
                activeFilter === "pure_veg"
                  ? "bg-[#711A31] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🌱 Pure Veg Only
            </button>
            <button
              onClick={() => setActiveFilter("jain")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 ${
                activeFilter === "jain"
                  ? "bg-[#711A31] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              ✨ Jain Only
            </button>
          </div>
        </div>
      </div>

      {/* MAP VIEW CONTAINER */}
      {viewMode === "map" && (
        <div className="w-full max-w-4xl px-3 sm:px-4 mt-3">
          <div className="relative w-full h-[68vh] sm:h-[72vh] rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-stone-100">
            {/* The real Leaflet Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Quick Map Legend Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-stone-200/80 text-[11px] flex items-center space-x-3 text-stone-700">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold">Active Dater</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-sm">☕</span>
                <span className="font-bold text-[#711A31]">Partner Cafe (15% OFF)</span>
              </span>
            </div>

            {/* Google Maps External Link Pill */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/cafes+and+restaurants+near+Bandra+West,+Mumbai`,
                    "_blank"
                  )
                }
                className="bg-white/90 hover:bg-white text-stone-800 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-stone-200 font-bold text-[10px] flex items-center space-x-1.5 transition active:scale-95"
                title="View in Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </button>
            </div>

            {/* INTERACTIVE BOTTOM SHEET / DRAWER: SELECTED USER */}
            {selectedUser && (
              <div className="absolute bottom-4 inset-x-3 sm:inset-x-6 z-20 animate-fadeIn">
                <div className="bg-white/98 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#711A31] via-[#E11D48] to-amber-400 shrink-0">
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className="w-full h-full object-cover rounded-full border-2 border-white"
                        />
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-serif font-black text-xl text-stone-900">
                            {selectedUser.name}, {selectedUser.age}
                          </h3>
                          {selectedUser.isShieldVerified && (
                            <span className="text-rose-600 text-xs bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-bold flex items-center space-x-0.5">
                              <span>🛡️</span>
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-stone-600 mt-0.5">
                          {selectedUser.profession} • {selectedUser.neighborhood}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-[11px]">
                          <span className="font-bold text-[#711A31] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            📍 {selectedUser.distanceKm} km away
                          </span>
                          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ● {selectedUser.activeStatus}
                          </span>
                          <span className="font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                            {selectedUser.diet}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Wave Button */}
                      <button
                        onClick={() => handleWaveAtUser(selectedUser)}
                        className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
                      >
                        <span>{wavingUserId === selectedUser.id ? "✨" : "👋"}</span>
                        <span>{wavingUserId === selectedUser.id ? "Waved!" : "Wave"}</span>
                      </button>

                      {/* Chat Button */}
                      <button
                        onClick={() => handleStartChatWithUser(selectedUser)}
                        className="flex-1 sm:flex-none bg-[#711A31] hover:bg-[#581426] text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-[#711A31]/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </button>

                      {/* Plan Date Invite Button */}
                      <button
                        onClick={() => setShowInviteModal({ user: selectedUser, cafe: PARTNER_CAFES[0] })}
                        className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-[#711A31] border border-rose-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
                      >
                        <span>☕</span>
                        <span>Invite to Date</span>
                      </button>
                    </div>
                  </div>

                  {/* Prompt Quote snippet */}
                  <div className="mt-3 bg-stone-50 rounded-2xl p-2.5 border border-stone-200/60 text-xs text-stone-700 italic">
                    "{selectedUser.prompt}"
                  </div>
                </div>
              </div>
            )}

            {/* INTERACTIVE BOTTOM SHEET / DRAWER: SELECTED PARTNER CAFE */}
            {selectedCafe && (
              <div className="absolute bottom-4 inset-x-3 sm:inset-x-6 z-20 animate-fadeIn">
                <div className="bg-white/98 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedCafe(null)}
                    className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-sm">
                        <img
                          src={selectedCafe.image}
                          alt={selectedCafe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-amber-400 text-stone-950 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                          15% OFF
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">
                            {selectedCafe.name}
                          </h3>
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            ★ {selectedCafe.rating}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                          {selectedCafe.address}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-[11px]">
                          <span className="font-bold text-[#711A31] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            🏷️ {selectedCafe.discountOffer}
                          </span>
                          <span className="font-medium text-stone-500">
                            {selectedCafe.avgCost}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Buttons for Cafe */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Google Maps Directions */}
                      <button
                        onClick={() =>
                          handleOpenGoogleMapsDirections(
                            selectedCafe.lat,
                            selectedCafe.lng,
                            selectedCafe.name
                          )
                        }
                        className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Directions</span>
                      </button>

                      {/* Plan Date at this cafe */}
                      <button
                        onClick={() =>
                          setShowInviteModal({
                            user: NEARBY_ACTIVE_USERS[0],
                            cafe: selectedCafe,
                          })
                        }
                        className="flex-1 sm:flex-none bg-[#711A31] hover:bg-[#581426] text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-[#711A31]/20"
                      >
                        <span>☕</span>
                        <span>Plan Date Here</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 font-medium mt-2 pt-2 border-t border-stone-100">
                    ✨ Partner Perk: {selectedCafe.partnerPerk}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIST VIEW (Alternative browsing for any network or device) */}
      {viewMode === "list" && (
        <div className="w-full max-w-4xl px-3 sm:px-4 mt-4 flex flex-col space-y-4">
          {/* Section: People Active Nearby */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#711A31]">
                  Active People Nearby ({filteredUsers.length})
                </span>
                <span className="text-xs text-stone-500 font-semibold">Sorted by proximity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white/95 backdrop-blur-2xl rounded-3xl p-4 border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#711A31] via-[#E11D48] to-amber-400 shrink-0">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full border-2 border-white" />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-serif font-black text-base text-stone-900 truncate">
                            {u.name}, {u.age}
                          </h4>
                          <span className="text-[10px] font-bold text-[#711A31] bg-rose-50 px-2 py-0.5 rounded-full">
                            {u.distanceKm} km
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 truncate">{u.profession}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5 truncate">{u.neighborhood}</p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 italic bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                      "{u.prompt}"
                    </p>

                    <div className="flex items-center space-x-2 pt-1 border-t border-stone-100">
                      <button
                        onClick={() => handleWaveAtUser(u)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <span>👋 Wave</span>
                      </button>
                      <button
                        onClick={() => handleStartChatWithUser(u)}
                        className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => setShowInviteModal({ user: u, cafe: PARTNER_CAFES[0] })}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-[#711A31] border border-rose-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <span>☕ Date</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Partner Cafes */}
          {filteredCafes.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#711A31]">
                  Partner Cafes & Safe Date Spots ({filteredCafes.length})
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  10-20% Off Bill
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCafes.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/95 backdrop-blur-2xl rounded-3xl p-4 border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-amber-400 text-stone-950 text-[8px] font-black px-1 rounded">
                          15% OFF
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-serif font-black text-sm text-stone-900 truncate">
                            {c.name}
                          </h4>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            ★ {c.rating}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 truncate mt-0.5">{c.address}</p>
                        <p className="text-[10px] font-bold text-[#711A31] mt-1">{c.discountOffer}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 font-medium bg-stone-50 p-2 rounded-xl border border-stone-100">
                      💡 Vibe: {c.vibe}
                    </p>

                    <div className="flex items-center space-x-2 pt-1 border-t border-stone-100">
                      <button
                        onClick={() => handleOpenGoogleMapsDirections(c.lat, c.lng, c.name)}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Google Maps</span>
                      </button>
                      <button
                        onClick={() => setShowInviteModal({ user: NEARBY_ACTIVE_USERS[0], cafe: c })}
                        className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <span>☕ Plan Date</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DATE INVITATION MODAL: PLAN DATE AT PARTNER CAFE */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/98 backdrop-blur-2xl rounded-[2.5rem] max-w-md w-full p-6 text-center shadow-2xl border border-stone-200 relative animate-fadeIn text-stone-900">
            <button
              onClick={() => setShowInviteModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-3xl bg-rose-50 text-[#711A31] text-2xl flex items-center justify-center mx-auto mb-3 border border-rose-200 shadow-sm">
              ☕
            </div>

            <h2 className="text-xl font-serif font-black text-stone-900">
              Plan Partner Cafe Date
            </h2>
            <p className="text-xs text-stone-600 mt-1 mb-5 leading-relaxed">
              Invite <strong className="text-stone-900">{showInviteModal.user?.name}</strong> to a verified safe date at{" "}
              <strong className="text-stone-900">{showInviteModal.cafe?.name}</strong>.
            </p>

            {/* Cafe Preview Card */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-5 text-left flex items-center space-x-3">
              <img
                src={showInviteModal.cafe?.image}
                alt={showInviteModal.cafe?.name}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-serif font-black text-sm text-stone-900 truncate">
                  {showInviteModal.cafe?.name}
                </h4>
                <p className="text-[11px] text-stone-600 truncate">{showInviteModal.cafe?.address}</p>
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-[#711A31] bg-rose-100/70 px-2 py-0.5 rounded-md">
                    🏷️ {showInviteModal.cafe?.discountOffer}
                  </span>
                </div>
              </div>
            </div>

            {/* Select Other Partner Cafes dropdown */}
            <div className="mb-4 text-left">
              <label className="text-[11px] font-black uppercase text-stone-600 block mb-1">
                Choose Partner Venue:
              </label>
              <select
                value={showInviteModal.cafe?.id}
                onChange={(e) => {
                  const found = PARTNER_CAFES.find((c) => c.id === e.target.value);
                  if (found) setShowInviteModal((prev) => ({ ...prev, cafe: found }));
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#711A31]"
              >
                {PARTNER_CAFES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.discountOffer.split("+")[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  toast.success(
                    `🎉 Date invitation sent to ${showInviteModal.user?.name} at ${showInviteModal.cafe?.name}! Date Pass QR unlocked with 15% discount.`,
                    { duration: 5000, icon: "☕" }
                  );
                  setShowInviteModal(null);
                  router.push(`/chat/${showInviteModal.user?.id || "like_1"}`);
                }}
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Send Date Invite & Unlock Pass</span>
                <span>✨</span>
              </button>

              <button
                onClick={() =>
                  handleOpenGoogleMapsDirections(
                    showInviteModal.cafe?.lat,
                    showInviteModal.cafe?.lng,
                    showInviteModal.cafe?.name
                  )
                }
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center space-x-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                <span>Preview Location on Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

