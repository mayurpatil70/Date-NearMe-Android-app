"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  Layers,
  Crosshair,
  AlertCircle,
  Eye,
  Check,
} from "lucide-react";

// Default Hotspot Anchor: Bandra West, Mumbai (matching Screenshot 1)
export const DEFAULT_CENTER = [19.0596, 72.8295];

// Google Maps Free Tile Layer URLs (lyrs=m Roadmap, lyrs=y Hybrid, lyrs=p Terrain)
const GOOGLE_TILE_LAYERS = {
  roadmap: {
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    label: "Google Roadmap",
    attribution: "Map data © Google",
  },
  satellite: {
    url: "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    label: "Google Satellite",
    attribution: "Imagery © Google",
  },
  terrain: {
    url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    label: "Google Terrain",
    attribution: "Terrain © Google",
  },
};

// Haversine formula for real-time geographic distance in KM
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

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
    lat: 19.0695,
    lng: 72.8350,
    rating: 4.7,
    reviews: 640,
    discountOffer: "15% OFF Total Bill on Date-NearMe Check-in",
    partnerPerk: "Romantic candlelit patio table + free artisanal dip platter",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
    vibe: "Boho Romantic, Fairy Lights, Cozy",
    avgCost: "₹850 for two",
  },
  {
    id: "cafe_third_wave",
    name: "Third Wave Coffee",
    tagline: "Modern Specialty Roastery & Perfect First-Date Icebreaker Seating",
    address: "Linking Road, Bandra West, Mumbai 400050",
    distanceKm: 0.9,
    lat: 19.0580,
    lng: 72.8335,
    rating: 4.8,
    reviews: 1820,
    discountOffer: "15% OFF + Buy 1 Get 1 on Handcrafted Cold Brews",
    partnerPerk: "Fast Wi-Fi, relaxed acoustic vibe, couple discount badge",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    vibe: "Modern Minimalist, Energizing, Coffee Lovers",
    avgCost: "₹600 for two",
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
  const tileLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'people' | 'cafes' | 'pure_veg' | 'jain'
  const [mapStyle, setMapStyle] = useState("roadmap"); // 'roadmap' | 'satellite' | 'terrain'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [viewMode, setViewMode] = useState("map"); // 'map' | 'list'
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Real-Time User Geolocation state
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [isGpsLive, setIsGpsLive] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [locationName, setLocationName] = useState("Bandra West, Mumbai (Hotspot)");
  const [isLocating, setIsLocating] = useState(false);

  const [wavingUserId, setWavingUserId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(null);

  // --------------------------------------------------------------------------
  // 1. AUTOMATIC REAL-TIME USER GEOLOCATION ON MOUNT
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    setIsLocating(true);

    // Initial high-accuracy GPS fix
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const liveCoords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(liveCoords);
        setIsGpsLive(true);
        setGpsAccuracy(Math.round(pos.coords.accuracy || 12));
        setIsLocating(false);
        setLocationName(`Your GPS Location (±${Math.round(pos.coords.accuracy || 12)}m)`);

        if (leafletMapRef.current) {
          leafletMapRef.current.setView(liveCoords, 15, { animate: true });
        }
        toast.success("Live GPS Location Synced with Google Map! 📍", { duration: 3500 });
      },
      (err) => {
        console.warn("Real-time GPS initial fix error or denied:", err.message);
        setIsLocating(false);
        setIsGpsLive(false);
        setLocationName("Bandra West, Mumbai (Hotspot)");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );

    // Real-time live continuous GPS tracking (updates as user moves)
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const liveCoords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(liveCoords);
        setIsGpsLive(true);
        setGpsAccuracy(Math.round(pos.coords.accuracy || 10));
      },
      (err) => console.warn("Watch position notification:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // 2. DYNAMICALLY PROJECT DATERS & RECALCULATE DISTANCES PER USER LOCATION
  // --------------------------------------------------------------------------
  const activeDaters = useMemo(() => {
    // Check if user is near the default Mumbai hotspot (within 35 km)
    const distToHotspot = calculateDistanceKm(
      userLocation[0],
      userLocation[1],
      DEFAULT_CENTER[0],
      DEFAULT_CENTER[1]
    );

    const isNearDefaultHotspot = distToHotspot < 35;

    return NEARBY_ACTIVE_USERS.map((u, index) => {
      // If user is near Mumbai, preserve original realistic Mumbai coordinates
      // If user is located elsewhere, dynamically offset pins around user's live GPS!
      let lat = u.lat;
      let lng = u.lng;
      let neighborhood = u.neighborhood;

      if (!isNearDefaultHotspot && isGpsLive) {
        // Natural radial distribution offsets around user's live GPS (~0.3km - 2.8km)
        const angles = [0.4, 1.2, 2.1, 2.9, 3.8, 4.6, 5.3, 6.0];
        const radii = [0.004, 0.007, 0.009, 0.012, 0.014, 0.006, 0.011, 0.015];
        const angle = angles[index % angles.length];
        const radius = radii[index % radii.length];

        lat = userLocation[0] + radius * Math.cos(angle);
        lng = userLocation[1] + radius * Math.sin(angle);
        neighborhood = "Your Neighborhood";
      }

      const realDistance = calculateDistanceKm(
        userLocation[0],
        userLocation[1],
        lat,
        lng
      );

      return {
        ...u,
        lat,
        lng,
        neighborhood,
        distanceKm: realDistance,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation, isGpsLive]);

  const activeCafes = useMemo(() => {
    const distToHotspot = calculateDistanceKm(
      userLocation[0],
      userLocation[1],
      DEFAULT_CENTER[0],
      DEFAULT_CENTER[1]
    );
    const isNearDefaultHotspot = distToHotspot < 35;

    return PARTNER_CAFES.map((c, index) => {
      let lat = c.lat;
      let lng = c.lng;

      if (!isNearDefaultHotspot && isGpsLive) {
        const angles = [0.8, 1.9, 3.4, 4.8, 5.7];
        const radii = [0.005, 0.008, 0.013, 0.016, 0.01];
        const angle = angles[index % angles.length];
        const radius = radii[index % radii.length];

        lat = userLocation[0] + radius * Math.cos(angle);
        lng = userLocation[1] + radius * Math.sin(angle);
      }

      const realDistance = calculateDistanceKm(
        userLocation[0],
        userLocation[1],
        lat,
        lng
      );

      return {
        ...c,
        lat,
        lng,
        distanceKm: realDistance,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation, isGpsLive]);

  // Filtered collections
  const filteredUsers = useMemo(() => {
    return activeDaters.filter((u) => {
      if (activeFilter === "cafes") return false;
      if (activeFilter === "pure_veg" && u.diet !== "Pure Veg") return false;
      if (activeFilter === "jain" && u.diet !== "Jain") return false;
      return true;
    });
  }, [activeDaters, activeFilter]);

  const filteredCafes = useMemo(() => {
    return activeCafes.filter(() => {
      if (activeFilter === "people" || activeFilter === "jain") return false;
      return true;
    });
  }, [activeCafes, activeFilter]);

  // --------------------------------------------------------------------------
  // 3. INITIALIZE LEAFLET WITH OFFICIAL GOOGLE MAPS TILES
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import("leaflet")).default;
        if (!mapContainerRef.current) return;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: userLocation,
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
        });

        // Add Google Maps Free Tile Layer
        const activeTileConfig = GOOGLE_TILE_LAYERS[mapStyle] || GOOGLE_TILE_LAYERS.roadmap;
        const tileLayer = L.tileLayer(activeTileConfig.url, {
          maxZoom: 20,
          subdomains: activeTileConfig.subdomains,
          attribution: activeTileConfig.attribution,
        }).addTo(map);

        tileLayerRef.current = tileLayer;

        // Custom bottom right controls
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Dynamic markers layer
        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        leafletMapRef.current = map;

        if (isMounted) {
          setMapLoaded(true);
        }
      } catch (err) {
        console.error("Leaflet Google Map initialization error:", err);
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

  // Update Tile Layer when user toggles Roadmap / Satellite / Terrain
  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current) return;

    async function updateTileLayer() {
      const L = (await import("leaflet")).default;
      if (tileLayerRef.current) {
        leafletMapRef.current.removeLayer(tileLayerRef.current);
      }

      const activeTileConfig = GOOGLE_TILE_LAYERS[mapStyle] || GOOGLE_TILE_LAYERS.roadmap;
      const newLayer = L.tileLayer(activeTileConfig.url, {
        maxZoom: 20,
        subdomains: activeTileConfig.subdomains,
        attribution: activeTileConfig.attribution,
      }).addTo(leafletMapRef.current);

      tileLayerRef.current = newLayer;
    }

    updateTileLayer();
  }, [mapStyle]);

  // --------------------------------------------------------------------------
  // 4. SYNC REAL-TIME GPS USER BEACON & INTERACTIVE MARKERS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const layer = markersLayerRef.current;
      layer.clearLayers();

      // 1. Current Live User GPS Pin (Authentic Google Maps pulsing blue beacon)
      const userDotHtml = `
        <div class="relative flex items-center justify-center w-10 h-10 group cursor-pointer">
          <div class="absolute w-10 h-10 rounded-full bg-blue-500/25 animate-ping"></div>
          <div class="absolute w-6 h-6 rounded-full bg-blue-500/40 animate-pulse"></div>
          <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-blue-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white/20">
            ${isGpsLive ? "Live GPS Location" : "You (Hotspot)"}
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: userDotHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker(userLocation, { icon: userIcon }).addTo(layer);

      // 2. Active Nearby Users Markers
      filteredUsers.forEach((u) => {
        const isSelected = selectedUser?.id === u.id;
        const userHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-115 ${
            isSelected ? "scale-115 z-30" : "z-10"
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
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-115 ${
            isSelected ? "scale-115 z-30" : "z-20"
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
  }, [filteredUsers, filteredCafes, selectedUser, selectedCafe, userLocation, isGpsLive]);

  // Recenter map immediately to user's real-time GPS
  const handleLocateMe = useCallback(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      setIsLocating(true);
      const toastId = toast.loading("Acquiring high-accuracy real-time GPS...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const liveCoords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(liveCoords);
          setIsGpsLive(true);
          setGpsAccuracy(Math.round(pos.coords.accuracy || 10));
          setIsLocating(false);
          setLocationName(`Your GPS Location (±${Math.round(pos.coords.accuracy || 10)}m)`);

          leafletMapRef.current?.setView(liveCoords, 16, { animate: true });
          toast.success("Google Map centered on your real-time GPS location! 📍", { id: toastId });
        },
        (err) => {
          setIsLocating(false);
          toast.error("Location permission denied. Defaulting to Bandra West hotspot.", { id: toastId });
          setUserLocation(DEFAULT_CENTER);
          leafletMapRef.current?.setView(DEFAULT_CENTER, 15, { animate: true });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      leafletMapRef.current?.setView(DEFAULT_CENTER, 15, { animate: true });
      toast("Browser does not support geolocation", { icon: "📍" });
    }
  }, []);

  // Jump to Bandra West hotspot
  const handleJumpToBandraHotspot = () => {
    setUserLocation(DEFAULT_CENTER);
    leafletMapRef.current?.setView(DEFAULT_CENTER, 15, { animate: true });
    toast.success("View switched to Bandra West Dating Hotspot ☕");
  };

  // Wave / Say Hi interaction
  const handleWaveAtUser = (targetUser) => {
    setWavingUserId(targetUser.id);
    toast.success(`You waved at ${targetUser.name}! If they wave back, a chat opens. 👋`, {
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

  // Open Google Maps turn-by-turn live navigation route from user's current GPS location
  const handleOpenGoogleMapsDirections = (destLat, destLng, destName) => {
    const origin = `${userLocation[0]},${userLocation[1]}`;
    const destination = `${destLat},${destLng}`;
    const place = encodeURIComponent(destName || `${destLat},${destLng}`);
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${place}&travelmode=driving`;
    window.open(gmapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col items-center relative min-h-screen pb-32">
      {/* TOP HEADER CONTROLS (Floating Glass Capsule) */}
      <div className="w-full max-w-4xl px-3 sm:px-4 pt-3 z-30 sticky top-1">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.06)] flex flex-col gap-2.5">
          {/* Status & Live Counter Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-2xl bg-rose-50 text-[#711A31] flex items-center justify-center font-bold text-sm shadow-sm border border-rose-100">
                <Compass className="w-4 h-4 text-[#711A31] animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-black text-sm text-stone-900 tracking-tight">
                    Real-Time Google Map
                  </span>
                  <span className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isGpsLive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isGpsLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                    <span>{isGpsLive ? "Live GPS Synced" : "Hotspot View"}</span>
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  {locationName} • {filteredUsers.length} Daters Near You
                </p>
              </div>
            </div>

            {/* Quick Actions (GPS Center & View Toggle) */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className={`p-2 rounded-2xl transition border text-xs flex items-center space-x-1 shadow-sm cursor-pointer ${
                  isGpsLive
                    ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200"
                }`}
                title="Center on Live GPS"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? "animate-spin text-blue-600" : "text-[#711A31]"}`} />
                <span className="hidden sm:inline text-[11px] font-bold">
                  {isLocating ? "Locating..." : "My GPS"}
                </span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                className="bg-[#711A31] text-white hover:bg-[#581426] px-3 py-2 rounded-2xl transition font-bold text-[11px] flex items-center space-x-1 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{viewMode === "map" ? "📋 List" : "🗺️ Map"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Filter Pills & Map Type Selector */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide pt-1">
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                All Nearby ({filteredUsers.length + filteredCafes.length})
              </button>
              <button
                onClick={() => setActiveFilter("people")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 flex items-center space-x-1 cursor-pointer ${
                  activeFilter === "people"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>🟢 People ({filteredUsers.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter("cafes")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 flex items-center space-x-1 cursor-pointer ${
                  activeFilter === "cafes"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>☕ Cafes ({filteredCafes.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter("pure_veg")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 cursor-pointer ${
                  activeFilter === "pure_veg"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                🌱 Pure Veg
              </button>
              <button
                onClick={() => setActiveFilter("jain")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition shrink-0 cursor-pointer ${
                  activeFilter === "jain"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                ✨ Jain
              </button>
            </div>

            {/* Google Maps Layer Switcher */}
            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-full shrink-0 border border-stone-200">
              <button
                onClick={() => setMapStyle("roadmap")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                  mapStyle === "roadmap"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Google Roadmap"
              >
                Roadmap
              </button>
              <button
                onClick={() => setMapStyle("satellite")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                  mapStyle === "satellite"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Google Satellite"
              >
                Satellite
              </button>
              <button
                onClick={() => setMapStyle("terrain")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                  mapStyle === "terrain"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Google Terrain"
              >
                Terrain
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAP VIEW CONTAINER */}
      {viewMode === "map" && (
        <div className="w-full max-w-4xl px-3 sm:px-4 mt-3">
          <div className="relative w-full h-[68vh] sm:h-[72vh] rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-stone-100">
            {/* The Real-Time Google Maps Leaflet Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Google Watermark Badge in Bottom-Left */}
            <div className="absolute bottom-3 left-4 z-10 pointer-events-none select-none flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-sans font-bold text-stone-600 shadow-sm border border-stone-200/50">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="text-stone-500 text-[9px] font-medium ml-1">Maps Live</span>
            </div>

            {/* Quick Map Legend & GPS Indicator */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-stone-200/80 text-[11px] flex items-center space-x-3 text-stone-700">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-bold">You (Live GPS)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold">Active Dater</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-sm">☕</span>
                <span className="font-bold text-[#711A31]">Partner Cafe</span>
              </span>
            </div>

            {/* Google Maps External Live Directions Button */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5">
              {!isGpsLive && (
                <button
                  onClick={handleLocateMe}
                  className="bg-blue-600 hover:bg-blue-700 text-white backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-blue-400 font-bold text-[10px] flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 animate-pulse" />
                  <span>Enable Live GPS</span>
                </button>
              )}

              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/cafes+and+restaurants/@${userLocation[0]},${userLocation[1]},15z`,
                    "_blank"
                  )
                }
                className="bg-white/95 hover:bg-white text-stone-800 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-stone-200 font-bold text-[10px] flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                title="Open in Official Google Maps App"
              >
                <span>Google Maps App</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </button>
            </div>

            {/* INTERACTIVE BOTTOM SHEET: SELECTED USER */}
            {selectedUser && (
              <div className="absolute bottom-4 inset-x-3 sm:inset-x-6 z-20 animate-fadeIn">
                <div className="bg-white/98 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs cursor-pointer"
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
                            📍 {selectedUser.distanceKm} km from you
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
                        className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                      >
                        <span>{wavingUserId === selectedUser.id ? "✨" : "👋"}</span>
                        <span>{wavingUserId === selectedUser.id ? "Waved!" : "Wave"}</span>
                      </button>

                      {/* Chat Button */}
                      <button
                        onClick={() => handleStartChatWithUser(selectedUser)}
                        className="flex-1 sm:flex-none bg-[#711A31] hover:bg-[#581426] text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-[#711A31]/20 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </button>

                      {/* Google Maps Directions to Meet */}
                      <button
                        onClick={() =>
                          handleOpenGoogleMapsDirections(
                            selectedUser.lat,
                            selectedUser.lng,
                            selectedUser.name
                          )
                        }
                        className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                        title="Directions from your live location"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Route</span>
                      </button>

                      {/* Plan Date Invite Button */}
                      <button
                        onClick={() => setShowInviteModal({ user: selectedUser, cafe: activeCafes[0] })}
                        className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-[#711A31] border border-rose-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                      >
                        <span>☕ Date</span>
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

            {/* INTERACTIVE BOTTOM SHEET: SELECTED PARTNER CAFE */}
            {selectedCafe && (
              <div className="absolute bottom-4 inset-x-3 sm:inset-x-6 z-20 animate-fadeIn">
                <div className="bg-white/98 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedCafe(null)}
                    className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs cursor-pointer"
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
                            {selectedCafe.distanceKm} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Buttons for Cafe */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Google Maps Directions with Live GPS Origin */}
                      <button
                        onClick={() =>
                          handleOpenGoogleMapsDirections(
                            selectedCafe.lat,
                            selectedCafe.lng,
                            selectedCafe.name
                          )
                        }
                        className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Google Route</span>
                      </button>

                      {/* Plan Date at this cafe */}
                      <button
                        onClick={() =>
                          setShowInviteModal({
                            user: activeDaters[0],
                            cafe: selectedCafe,
                          })
                        }
                        className="flex-1 sm:flex-none bg-[#711A31] hover:bg-[#581426] text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-[#711A31]/20 cursor-pointer"
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
                <span className="text-xs text-stone-500 font-semibold">
                  Sorted by live GPS proximity
                </span>
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
                            {u.distanceKm} km away
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
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>👋 Wave</span>
                      </button>
                      <button
                        onClick={() => handleStartChatWithUser(u)}
                        className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => handleOpenGoogleMapsDirections(u.lat, u.lng, u.name)}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Route</span>
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
                        <p className="text-[10px] font-bold text-[#711A31] mt-1">
                          {c.discountOffer} • {c.distanceKm} km away
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 font-medium bg-stone-50 p-2 rounded-xl border border-stone-100">
                      💡 Vibe: {c.vibe}
                    </p>

                    <div className="flex items-center space-x-2 pt-1 border-t border-stone-100">
                      <button
                        onClick={() => handleOpenGoogleMapsDirections(c.lat, c.lng, c.name)}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                        <span>Google Route</span>
                      </button>
                      <button
                        onClick={() => setShowInviteModal({ user: activeDaters[0], cafe: c })}
                        className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
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
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
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
                  const found = activeCafes.find((c) => c.id === e.target.value);
                  if (found) setShowInviteModal((prev) => ({ ...prev, cafe: found }));
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#711A31]"
              >
                {activeCafes.map((c) => (
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
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
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
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#711A31]" />
                <span>Live Google Maps Turn-by-Turn Route</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
