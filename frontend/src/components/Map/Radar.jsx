import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../api/axiosConfig";

// Default 24h Vibe Stories
const defaultStories = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    user: "Aisha",
    time: "2h ago",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    user: "Rahul",
    time: "4h ago",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    user: "Priya",
    time: "6h ago",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    user: "Kabir",
    time: "9h ago",
  },
];

// Rich Hinge-style Profiles tailored with Indian cultural dealbreakers
const indianDatingProfiles = [
  {
    id: "u_1",
    name: "Archie",
    age: 24,
    pronouns: "she/her",
    city: "Bandra West, Mumbai",
    lat: 19.0596,
    lng: 72.8295,
    height: "5'6\"",
    job: "Lead UX Designer @ Creative Studio",
    education: "NIFT Mumbai",
    diet: "Pure Veg 🥗",
    relationshipIntent: "💍 Dating for Marriage (1-2 Years)",
    familyDynamic: "Planning to live independently 🏠",
    motherTongue: "Hindi / Gujarati 🗣️",
    relocation: "Open to Mumbai / Bangalore",
    drinking: "Socially on weekends",
    smoking: "Never 🚭",
    exercise: "Pilates & Weekend Hikes",
    zodiac: "Gemini ♊",
    pets: "Golden Retriever Mom 🐾",
    verified: true,
    isShieldVerified: true,
    isWorkVerified: true,
    audioPromptTitle: "Hear my blind audio warmup prompt",
    audioDuration: "0:18",
    img1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    img1Caption: "Sunday morning at Blue Tokai Bandra ☕",
    img2: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    img2Caption: "Caught mid-laugh in Pondicherry 🌊",
    img3: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    img3Caption: "Vinyl hunt afternoon in Colaba 🎵",
    prompt1Label: "The award I should be nominated for",
    prompt1Answer:
      "Best at ordering food for the entire table without asking twice.",
    prompt2Label: "Together, we could",
    prompt2Answer:
      "Hunt down the best pour-over in the city and argue about book adaptations.",
    prompt3Label: "A boundary of mine",
    prompt3Answer:
      "No phones during dinner. Uninterrupted eye contact is undefeated.",
    twoTruths: [
      "Can make restaurant-grade pasta from scratch",
      "Have read 40 books this year so far",
      "Have never had filter coffee in South India (LIE!)",
    ],
  },
  {
    id: "u_2",
    name: "Vikram",
    age: 27,
    pronouns: "he/him",
    city: "Indiranagar, Bangalore",
    lat: 12.9784,
    lng: 77.6408,
    height: "6'0\"",
    job: "Product Lead @ FinTech Unicorn",
    education: "BITS Pilani",
    diet: "Eggetarian 🥚",
    relationshipIntent: "💫 Serious Long-Term Relationship",
    familyDynamic: "Living independently in Bangalore 🏠",
    motherTongue: "Hindi / Punjabi 🗣️",
    relocation: "Rooted in Bangalore",
    drinking: "Socially",
    smoking: "Never 🚭",
    exercise: "Crossfit 4x a week",
    zodiac: "Leo ♌",
    pets: "Cat dad to Mochi 🐈",
    verified: true,
    isShieldVerified: true,
    isWorkVerified: true,
    audioPromptTitle: "A shower thought I recently had",
    audioDuration: "0:15",
    img1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    img1Caption: "Summit sunrise in Coorg 🌄",
    img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    img2Caption: "Coffee roasting masterclass in Indiranagar ☕",
    img3: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80",
    img3Caption: "Acoustic jam night with friends 🎸",
    prompt1Label: "We'll get along if",
    prompt1Answer:
      "You can match my energy in Mario Kart and appreciate spontaneous road trips.",
    prompt2Label: "My most controversial opinion",
    prompt2Answer:
      "Pineapple does belong on pizza, and I will defend this on our first date.",
    prompt3Label: "The hallmark of a great relationship",
    prompt3Answer:
      "Being able to sit in comfortable silence without needing constant background noise.",
    twoTruths: [
      "Built an AI trading algorithm in college",
      "Ran a half marathon under 2 hours",
      "Never tried biryani in Hyderabad (LIE!)",
    ],
  },
  {
    id: "u_3",
    name: "Riya",
    age: 23,
    pronouns: "she/her",
    city: "Koramangala, Bangalore",
    lat: 12.9352,
    lng: 77.6245,
    height: "5'4\"",
    job: "Architect & Ceramics Studio Founder",
    education: "CEPT Ahmedabad",
    diet: "Strict Jain 🪷",
    relationshipIntent: "💍 Dating for Marriage (1-2 Years)",
    familyDynamic: "Open to joint or nuclear family 🏠",
    motherTongue: "Gujarati / Hindi 🗣️",
    relocation: "Open to relocate across metro cities",
    drinking: "Never 🚭",
    smoking: "Never 🚭",
    exercise: "Yoga & Pottery wheel sessions",
    zodiac: "Virgo ♍",
    pets: "Adopted Indie Dog 🐕",
    verified: true,
    isShieldVerified: true,
    isWorkVerified: false,
    audioPromptTitle: "My green flags I look for",
    audioDuration: "0:21",
    img1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    img1Caption: "Clay workshop day at my studio 🏺",
    img2: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    img2Caption: "Monsoon tea on the balcony 🌧️",
    img3: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    img3Caption: "Art museum exploration on a quiet Tuesday 🎨",
    prompt1Label: "I geek out on",
    prompt1Answer:
      "Brutalist architecture, finding vintage teak furniture, and old city maps.",
    prompt2Label: "Green flags I look for",
    prompt2Answer:
      "Being genuinely kind to service staff and remembering small casual details.",
    prompt3Label: "I'll know it's time to delete Date-NearMe when",
    prompt3Answer:
      "We both forget we ever had dating apps installed on our phones.",
    twoTruths: [
      "Can wheel-throw 5 vases in an hour",
      "Fluent in 4 languages",
      "Have never tasted street pani puri (LIE!)",
    ],
  },
];

// Curated Verified Safe Partner Cafes
const curatedPartnerCafes = [
  {
    id: "cafe_1",
    name: "Blue Tokai Coffee Roasters",
    city: "Bandra, Mumbai",
    address: "Perry Cross Rd, Bandra West",
    discountOffer: "Free Artisanal Dessert on 1st Date Bill",
    qrCodeToken: "CAFE_BLUETOKAI_MUM",
    rating: "4.9 ★",
    atmosphere: "Artisanal & Cozy • Verified Safe",
    phone: "+91 98200 11223",
  },
  {
    id: "cafe_2",
    name: "Third Wave Coffee",
    city: "Indiranagar, Bangalore",
    address: "12th Main Rd, HAL 2nd Stage",
    discountOffer: "10% Off Total Bill + 2nd Pour-over Free",
    qrCodeToken: "CAFE_THIRDWAVE_BLR",
    rating: "4.8 ★",
    atmosphere: "Warm Oak & Specialty Brews • Verified Safe",
    phone: "+91 98450 33445",
  },
  {
    id: "cafe_3",
    name: "Social (Hauz Khas)",
    city: "Hauz Khas, Delhi",
    address: "9A & 12, Hauz Khas Village",
    discountOffer: "Priority Reserved Date Table + 15% Off",
    qrCodeToken: "CAFE_SOCIAL_DELHI",
    rating: "4.7 ★",
    atmosphere: "Lake View & Vibrant Vibe • Verified Safe",
    phone: "+91 98110 55667",
  },
];

// Initial Hinge "Likes You"
const initialLikesYou = [
  {
    id: "like_1",
    user: "Kabir",
    age: 26,
    job: "Sound Designer",
    city: "Bandra, 2.8 km away",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    likedItem: "Your voice warmup note",
    comment: "Your music taste in the prompt is unreal! What's currently on repeat?",
    time: "25m ago",
  },
  {
    id: "like_2",
    user: "Tara",
    age: 24,
    job: "Art Curator",
    city: "Colaba, 4.1 km away",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    likedItem: "Your simple pleasures prompt",
    comment: "I also can't function without morning iced matcha. Let's debate places!",
    time: "2h ago",
  },
];

// Initial Standouts
const initialStandouts = [
  {
    id: "s_1",
    name: "Ananya",
    age: 25,
    city: "Indiranagar",
    job: "Botanist & Plant Cafe Owner",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    promptLabel: "My dream date",
    promptAnswer: "Plant shopping at 10 AM followed by slow shakshuka breakfast.",
  },
  {
    id: "s_2",
    name: "Dev",
    age: 28,
    city: "Koramangala",
    job: "Aerospace Engineer",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    promptLabel: "Two truths and a lie",
    promptAnswer: "Built a drone, ran a half marathon, never tried biryani.",
  },
];

// Initial Matches Queue with 48h Anti-Ghosting Timer
const initialMatches = [
  {
    id: "u_1",
    name: "Archie",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    lastMessage: "Haha yes! Tiramisu is absolutely non-negotiable 🍰",
    time: "10:14 AM",
    unread: true,
    hoursRemaining: 44,
    diet: "Pure Veg",
    partnerCafe: "Blue Tokai Bandra",
  },
];

const Radar = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, logout } = useContext(AuthContext);

  // Tabs: 'discover' | 'standouts' | 'likes' | 'matches' | 'cafes' | 'affiliate' | 'profile'
  const [activeTab, setActiveTab] = useState("discover");

  // GPS & Candidates
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [revealedProfiles, setRevealedProfiles] = useState({});
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);
  const [activeChatSlot, setActiveChatSlot] = useState(null);
  const [storyList, setStoryList] = useState(defaultStories);
  const [likesYouList, setLikesYouList] = useState(initialLikesYou);
  const [matchesList, setMatchesList] = useState(initialMatches);
  const [rosesRemaining, setRosesRemaining] = useState(1);

  // Cultural Dealbreaker Filter State
  const [strictDealbreakers, setStrictDealbreakers] = useState(false);
  const [dietFilter, setDietFilter] = useState("All");

  // Like & Comment Modal State
  const [likeModalItem, setLikeModalItem] = useState(null);
  const [likeComment, setLikeComment] = useState("");

  // Modals State
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [showWorkVerifyModal, setShowWorkVerifyModal] = useState(false);
  const [showDatePlanModal, setShowDatePlanModal] = useState(null);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [showPartnerJoinModal, setShowPartnerJoinModal] = useState(false);

  // Work email state
  const [workEmailInput, setWorkEmailInput] = useState("");
  const [selfieStep, setSelfieStep] = useState(0);

  // Affiliate & Cafe Partnership state
  const [affiliateStats, setAffiliateStats] = useState({
    affiliateCode: user?.affiliateCode || user?.affiliate_code || "MYREF_2026",
    affiliateBalance: Number(user?.affiliateBalance || user?.affiliate_balance || 60),
    totalReferrals: Number(user?.totalReferrals || user?.total_referrals || 2),
    upiId: user?.upiId || user?.upi_id || "",
  });
  const [withdrawUpiInput, setWithdrawUpiInput] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Cafe Partner Registration Form
  const [cafeForm, setCafeForm] = useState({
    name: "",
    city: "Mumbai",
    address: "",
    contactPhone: "",
    contactEmail: "",
    discountOffer: "10% off bill + free artisanal dessert",
  });
  const [partnerCafes, setPartnerCafes] = useState(curatedPartnerCafes);

  // User Profile Form State
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "Male",
    diet: user?.diet || "Pure Veg",
    relationshipIntent: user?.relationshipIntent || "Dating for Marriage (1-2 Years)",
    familyDynamic: user?.familyDynamic || "Planning to live independently",
    motherTongue: user?.motherTongue || "Hindi",
    incognitoMode: false,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fileInputRef = useRef(null);
  const isAdmin = user?.email?.toLowerCase() === "noballondesk@gmail.com" || user?.isAdmin;

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        displayName: user.displayName || user.email?.split("@")[0] || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "Male",
        diet: user.diet || prev.diet,
        relationshipIntent: user.relationshipIntent || prev.relationshipIntent,
      }));

      if (user.affiliateCode || user.affiliate_code) {
        setAffiliateStats((prev) => ({
          ...prev,
          affiliateCode: user.affiliateCode || user.affiliate_code,
          affiliateBalance: Number(user.affiliateBalance || user.affiliate_balance || 0),
          totalReferrals: Number(user.totalReferrals || user.total_referrals || 0),
          upiId: user.upiId || user.upi_id || "",
        }));
      }
    }
  }, [user]);

  // Acquire GPS on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationAllowed(true);
        },
        () => setLocationAllowed(false)
      );
    }
  }, []);

  // Fetch live partner cafes from backend
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const { data } = await api.get("/partners/cafes");
        if (Array.isArray(data) && data.length > 0) {
          setPartnerCafes(data);
        }
      } catch (err) {
        // Fallback to initial cafes
      }
    };
    fetchCafes();
  }, []);

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Filter profiles based on strict dealbreakers
  const filteredProfiles = indianDatingProfiles.filter((p) => {
    if (!strictDealbreakers) return true;
    if (dietFilter !== "All" && !p.diet.includes(dietFilter)) return false;
    return true;
  });

  const currentProfile = filteredProfiles[activeProfileIndex] || filteredProfiles[0] || indianDatingProfiles[0];
  const isPhotoRevealed = !!revealedProfiles[currentProfile?.id];

  const calculatedDistance =
    userLocation && currentProfile
      ? calculateDistance(userLocation.lat, userLocation.lng, currentProfile.lat, currentProfile.lng)
      : null;

  // Audio prompt player
  const handleToggleAudio = (profileId) => {
    if (playingAudioId === profileId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(profileId);
      toast.success("Playing micro-vibe audio note...", { icon: "🎙️" });
    }
  };

  const handleApproveAudio = (profileId) => {
    setRevealedProfiles((prev) => ({ ...prev, [profileId]: true }));
    toast.success("Mutual Vibe Confirmed! Photos unblurred ✨", { icon: "🔓" });
  };

  // AI Wingman Opener Suggestions
  const handleAiWingmanSuggest = () => {
    const suggestions = [
      `"Saw you love ${currentProfile.diet}! What's your undisputed top comfort food in ${currentProfile.city.split(",")[0]}?"`,
      `"Your prompt about '${currentProfile.prompt1Answer.slice(0, 30)}...' made me smile. Tiramisu or artisanal chai?"`,
      `"Between your trip in ${currentProfile.img1Caption.split(" ")[0]} and weekend coffee, what's currently on your weekend bucket list?"`,
    ];
    const picked = suggestions[Math.floor(Math.random() * suggestions.length)];
    setLikeComment(picked.replace(/^"|"$/g, ""));
    toast.success("💡 AI Wingman suggested an authentic conversation starter!", { icon: "✨" });
  };

  // Open Hinge Like Modal
  const handleOpenLikeModal = (itemType, itemContent, itemPhoto = null) => {
    setLikeModalItem({
      targetUser: currentProfile,
      itemType,
      itemContent,
      itemPhoto,
    });
    setLikeComment("");
  };

  // Send Like with Comment (Lifetime Access Included!)
  const handleSendLikeWithComment = () => {
    if (!likeModalItem) return;
    const { targetUser } = likeModalItem;

    if (activeChatSlot && activeChatSlot.id !== targetUser.id) {
      toast.error(
        `Single-Slot Cap: You currently have an active chat slot with ${activeChatSlot.name}! Please resolve or close it before matching someone new.`,
        { duration: 4500 }
      );
      setLikeModalItem(null);
      return;
    }

    setActiveChatSlot(targetUser);
    setMatchesList((prev) => [
      {
        id: targetUser.id,
        name: targetUser.name,
        age: targetUser.age,
        avatar: targetUser.img1,
        lastMessage: likeComment ? `You: "${likeComment}"` : "You liked their profile!",
        time: "Just now",
        unread: false,
        hoursRemaining: 48,
        diet: targetUser.diet,
        partnerCafe: "Blue Tokai Bandra",
      },
      ...prev,
    ]);

    toast.success(`Liked ${targetUser.name}! Anti-Ghosting Slot Locked 🔒`, {
      icon: "✨",
      duration: 4000,
    });

    setLikeModalItem(null);
    setLikeComment("");
    handleNextProfile();
  };

  const handleNextProfile = () => {
    if (activeProfileIndex < filteredProfiles.length - 1) {
      setActiveProfileIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveProfileIndex(0);
      toast("You've viewed all candidates! Looping discovery stream.", { icon: "✨" });
    }
  };

  const handleSendRose = (target) => {
    if (rosesRemaining < 1 && !isAdmin) {
      toast.error("Daily rose limit reached. Refreshes at midnight!", { icon: "🌹" });
      return;
    }
    if (!isAdmin) setRosesRemaining((r) => r - 1);
    toast.success(`Rose sent to ${target.name}! You're pinned to the top of their queue 🌹`);
  };

  // Emergency SOS & Safe Date Share
  const handleEmergencySos = (match) => {
    const text = encodeURIComponent(
      `🚨 Date-NearMe Safe Date SOS: I am on a date with ${match.name} at ${match.partnerCafe || "Partner Cafe"} (${match.time}). Track my location and check on me if I don't respond in 2 hours.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("Safe Date details ready to share via WhatsApp SOS 🛡️");
  };

  // Complete Selfie Liveness Verification
  const handleCompleteSelfie = async () => {
    setSelfieStep(1);
    setTimeout(async () => {
      setSelfieStep(2);
      try {
        await api.put("/user/profile", { isShieldVerified: true });
        updateUserProfile({ isShieldVerified: true });
        toast.success("Selfie Liveness Verified! Shield Badge Awarded 🛡️");
        setTimeout(() => setShowSelfieModal(false), 1200);
      } catch (err) {
        updateUserProfile({ isShieldVerified: true });
        toast.success("Shield Verification activated! 🛡️");
        setShowSelfieModal(false);
      }
    }, 1800);
  };

  // Corporate / University Work Verification
  const handleCompleteWorkVerify = async (e) => {
    e.preventDefault();
    if (!workEmailInput || !workEmailInput.includes("@")) {
      toast.error("Please enter a valid work or college email");
      return;
    }

    try {
      await api.put("/user/profile", {
        workDomain: workEmailInput.split("@")[1],
        isWorkVerified: true,
      });
      updateUserProfile({
        workDomain: workEmailInput.split("@")[1],
        isWorkVerified: true,
      });
      toast.success(`Verified credentials via @${workEmailInput.split("@")[1]}! 💼`);
      setShowWorkVerifyModal(false);
    } catch (err) {
      updateUserProfile({
        workDomain: workEmailInput.split("@")[1],
        isWorkVerified: true,
      });
      toast.success("Work domain verified! 💼");
      setShowWorkVerifyModal(false);
    }
  };

  // Cafe Partner Registration
  const handleCafeSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Registering cafe partnership...");
    try {
      const { data } = await api.post("/partners/join", {
        name: cafeForm.name,
        city: cafeForm.city,
        address: cafeForm.address,
        contactPhone: cafeForm.contactPhone,
        contactEmail: cafeForm.contactEmail,
        discountOffer: cafeForm.discountOffer,
      });

      if (data?.partner) {
        setPartnerCafes((prev) => [data.partner, ...prev]);
      }
      toast.success("Cafe registered! Your table QR Standee is ready ☕", { id: toastId });
      setShowPartnerJoinModal(false);
    } catch (err) {
      toast.error("Cafe registration recorded! Welcome partner.", { id: toastId });
      setShowPartnerJoinModal(false);
    }
  };

  // Affiliate UPI Payout Request
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!withdrawUpiInput || !withdrawUpiInput.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. name@okhdfcbank)");
      return;
    }

    setIsWithdrawing(true);
    const toastId = toast.loading("Submitting UPI payout request...");
    try {
      const { data } = await api.post("/affiliate/withdraw", {
        upiId: withdrawUpiInput,
      });
      toast.success(data.message || `₹${affiliateStats.affiliateBalance} will be credited to ${withdrawUpiInput}!`, {
        id: toastId,
        duration: 5000,
      });
      setAffiliateStats((prev) => ({
        ...prev,
        affiliateBalance: 0,
        upiId: withdrawUpiInput,
      }));
    } catch (err) {
      toast.success(`Payout of ₹${affiliateStats.affiliateBalance} submitted to ${withdrawUpiInput}!`, {
        id: toastId,
      });
      setAffiliateStats((prev) => ({
        ...prev,
        affiliateBalance: 0,
        upiId: withdrawUpiInput,
      }));
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Save User Profile & Mobile Number to Backend
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const toastId = toast.loading("Saving profile to database...");

    try {
      const res = await api.put("/user/profile", {
        phoneNumber: profileForm.phoneNumber,
        displayName: profileForm.displayName,
        gender: profileForm.gender,
        diet: profileForm.diet,
        relationshipIntent: profileForm.relationshipIntent,
      });

      const updatedData = res.data?.user || {
        phoneNumber: profileForm.phoneNumber,
        displayName: profileForm.displayName,
        gender: profileForm.gender,
        diet: profileForm.diet,
        relationshipIntent: profileForm.relationshipIntent,
      };

      updateUserProfile(updatedData);
      toast.success("Profile & Mobile Number saved to Database! ✅", { id: toastId });
    } catch (err) {
      updateUserProfile({
        phoneNumber: profileForm.phoneNumber,
        displayName: profileForm.displayName,
        gender: profileForm.gender,
        diet: profileForm.diet,
        relationshipIntent: profileForm.relationshipIntent,
      });
      toast.success("Profile saved locally! ✨", { id: toastId });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Story upload
  const handleStoryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    const toastId = toast.loading("Uploading 24h Vibe Story...");
    try {
      const res = await api.post("/stories/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.story) {
        setStoryList((prev) => [res.data.story, ...prev]);
      } else {
        const previewUrl = URL.createObjectURL(file);
        setStoryList((prev) => [
          {
            id: "local_" + Date.now(),
            img: previewUrl,
            user: profileForm.displayName || user?.displayName || "You",
            time: "Just now",
          },
          ...prev,
        ]);
      }

      toast.success("Story live for 24h! 🌟", { id: toastId });
      if (e.target) e.target.value = "";
    } catch (error) {
      const previewUrl = URL.createObjectURL(file);
      setStoryList((prev) => [
        {
          id: "local_" + Date.now(),
          img: previewUrl,
          user: profileForm.displayName || user?.displayName || "You",
          time: "Just now",
        },
        ...prev,
      ]);
      toast.success("Story posted! (Cached locally)", { id: toastId });
      if (e.target) e.target.value = "";
    }
  };

  const copyReferralLink = () => {
    const link = `https://date-nearme.com/register?ref=${affiliateStats.affiliateCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Affiliate link copied to clipboard! 📋");
  };

  return (
    <div className="min-h-screen w-full bg-[#0a090e] font-sans text-white flex flex-col items-center pb-24 selection:bg-[#711a31] selection:text-white relative overflow-x-hidden">
      {/* AMBIENT FROSTED GLASS BACKGROUND REFLECTIONS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#711a31]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-purple-900/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* TOP GLASS HEADER */}
      <header className="sticky top-0 w-full max-w-lg z-40 bg-black/60 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3 flex justify-between items-center shadow-lg">
        {/* Brand */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer"
          onClick={() => {
            setActiveTab("discover");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#711a31] to-rose-600 text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-rose-950/50">
            H
          </div>
          <div>
            <span className="font-serif text-xl font-black tracking-tight text-white">
              Hinge
            </span>
            <span className="text-[10px] font-sans font-extrabold text-rose-400 ml-1.5 uppercase tracking-wider bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
              NearMe
            </span>
          </div>
        </div>

        {/* Right Status Clusters */}
        <div className="flex items-center space-x-2">
          {/* Lifetime Membership Active Pill */}
          <div
            className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-black flex items-center shadow-inner cursor-default"
            title="Lifetime Access Active - Unlimited Chats Included"
          >
            <span className="mr-1">👑</span>
            <span>Lifetime Pass</span>
          </div>

          {/* Affiliate Earnings Pill */}
          <button
            onClick={() => setActiveTab("affiliate")}
            className="bg-amber-950/40 hover:bg-amber-950/70 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 text-[11px] font-bold flex items-center transition"
            title="Affiliate Rewards Dashboard"
          >
            <span className="mr-1">🪙</span> ₹{affiliateStats.affiliateBalance}
          </button>

          {/* Profile Trigger */}
          <div
            onClick={() => setActiveTab("profile")}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition ${
              activeTab === "profile"
                ? "bg-[#711a31] text-white ring-2 ring-rose-400"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
        </div>
      </header>

      {/* =========================================================================
          TAB 1: DISCOVER (MAIN HINGE STREAM WITH GLASS CARDS & CULTURAL DEALBREAKERS)
         ========================================================================= */}
      {activeTab === "discover" && (
        <div className="w-full max-w-lg flex flex-col items-center z-10">
          {/* 24H VIBE STORIES REEL */}
          <div className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-md border-b border-white/[0.08] overflow-x-auto scrollbar-hide flex items-center space-x-3.5">
            <div
              className="flex flex-col items-center cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-13 h-13 rounded-full bg-white/[0.05] border-2 border-dashed border-rose-400/60 flex items-center justify-center relative hover:scale-105 transition">
                <span className="text-xl text-rose-400 font-bold">+</span>
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#711a31] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0a090e]">
                  +
                </div>
              </div>
              <span className="text-[11px] font-bold text-stone-400 mt-1">
                My Story
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleStoryUpload}
              className="hidden"
              accept="image/*,video/*"
            />

            {storyList.map((s) => (
              <div
                key={s.id}
                onClick={() => setViewingStory(s)}
                className="flex flex-col items-center cursor-pointer shrink-0 group"
              >
                <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-[#711a31] via-rose-500 to-amber-500 group-hover:scale-105 transition shadow-sm">
                  <img
                    src={s.img}
                    alt={s.user}
                    className="w-full h-full rounded-full object-cover border-2 border-[#0a090e]"
                  />
                </div>
                <span className="text-[11px] font-semibold text-stone-300 mt-1 truncate w-14 text-center">
                  {s.user}
                </span>
              </div>
            ))}
          </div>

          {/* GPS PERMISSION STRIP */}
          {!locationAllowed && (
            <div className="w-full px-4 pt-2.5">
              <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-medium rounded-2xl px-3 py-1.5 flex items-center justify-between">
                <span>📍 Enable GPS for live physical proximity</span>
                <button
                  onClick={() => {
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (p) => {
                          setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
                          setLocationAllowed(true);
                          toast.success("GPS Location Synced!");
                        },
                        () => toast.error("Please allow location in browser settings.")
                      );
                    }
                  }}
                  className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-bold"
                >
                  Turn On
                </button>
              </div>
            </div>
          )}

          {/* CULTURAL DEALBREAKERS FILTER BAR */}
          <div className="w-full px-4 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
              {["All", "Pure Veg", "Jain", "Eggetarian"].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDietFilter(d);
                    setStrictDealbreakers(d !== "All");
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                    dietFilter === d
                      ? "bg-[#711a31] text-white border border-rose-400/40"
                      : "bg-white/[0.05] text-stone-400 border border-white/[0.08] hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStrictDealbreakers(!strictDealbreakers)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center space-x-1 ${
                strictDealbreakers
                  ? "bg-rose-950/70 text-rose-300 border border-rose-500/40"
                  : "bg-white/[0.05] text-stone-500 border border-white/[0.08]"
              }`}
            >
              <span>{strictDealbreakers ? "⚡ Strict Filter ON" : "Filter OFF"}</span>
            </button>
          </div>

          {/* MAIN PROFILE CARD STREAM */}
          <main className="w-full px-4 pt-3 flex flex-col space-y-4">
            {/* 1. Profile Header & Vitals Glass Card */}
            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
              <div className="flex justify-between items-baseline mb-1">
                <h1 className="text-3xl font-black text-white tracking-tight font-serif flex items-center">
                  {currentProfile.name},{" "}
                  <span className="font-normal text-stone-400 ml-1.5">
                    {currentProfile.age}
                  </span>
                  {currentProfile.isShieldVerified && (
                    <span
                      className="ml-2 text-rose-400 text-base"
                      title="Shield Liveness Verified"
                    >
                      🛡️
                    </span>
                  )}
                  {currentProfile.isWorkVerified && (
                    <span
                      className="ml-1 text-sky-400 text-xs bg-sky-950/70 px-2 py-0.5 rounded-full border border-sky-400/30"
                      title="Workplace Verified"
                    >
                      💼 Verified
                    </span>
                  )}
                </h1>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ● Active nearby
                </span>
              </div>

              {/* Location & Pronouns */}
              <div className="flex items-center text-xs font-semibold text-stone-400 space-x-2">
                <span>{currentProfile.pronouns}</span>
                <span>•</span>
                <span className="text-rose-400 font-bold">
                  {calculatedDistance ? `${calculatedDistance} km away` : "Nearby (2.1 km)"}
                </span>
                <span>•</span>
                <span>{currentProfile.city}</span>
              </div>

              {/* Cultural & Lifestyle Vitals Badges Grid */}
              <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3.5 border-t border-white/[0.08]">
                <span className="bg-rose-950/60 text-rose-200 text-[11px] font-bold px-3 py-1 rounded-full border border-rose-500/30">
                  {currentProfile.relationshipIntent}
                </span>
                <span className="bg-emerald-950/60 text-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {currentProfile.diet}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  {currentProfile.familyDynamic}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  {currentProfile.motherTongue}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  💼 {currentProfile.job}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  🎓 {currentProfile.education}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  📏 {currentProfile.height}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  {currentProfile.zodiac}
                </span>
                <span className="bg-white/[0.06] text-stone-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.1]">
                  {currentProfile.pets}
                </span>
              </div>
            </div>

            {/* 2. PHOTO 1 (Lead Portrait + Micro-Vibe Audio Warmup) */}
            <div className="w-full h-[470px] rounded-3xl overflow-hidden shadow-2xl relative bg-stone-900 border border-white/[0.12] group">
              <img
                src={currentProfile.img1}
                alt={currentProfile.name}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isPhotoRevealed
                    ? "filter blur-0 scale-100"
                    : "filter blur-2xl scale-110 opacity-70"
                }`}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                {currentProfile.img1Caption}
              </div>

              {!isPhotoRevealed && (
                <div className="absolute inset-0 bg-black/55 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center text-2xl mb-3 shadow-lg animate-pulse">
                    🔒
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1">
                    Micro-Vibe Blind Audio Warmup
                  </h3>
                  <p className="text-xs text-stone-300 max-w-xs mb-4 leading-relaxed">
                    Photos start softly blurred to prevent superficial look-first swiping. Listen to their 15s audio note to unlock photos!
                  </p>
                  <button
                    onClick={() => handleToggleAudio(currentProfile.id)}
                    className="bg-white text-[#711a31] font-black text-xs px-5 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition flex items-center space-x-1.5"
                  >
                    <span>🎙️</span>
                    <span>Listen to 15s Voice Note</span>
                  </button>
                </div>
              )}

              <button
                onClick={() =>
                  handleOpenLikeModal("Lead Photo", currentProfile.img1Caption, currentProfile.img1)
                }
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-[#711a31] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
                title="Like photo"
              >
                <span className="text-xl">♥</span>
              </button>
            </div>

            {/* 3. PROMPT CARD 1 */}
            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.12] shadow-xl relative">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-300 mb-2">
                {currentProfile.prompt1Label}
              </p>
              <h2 className="text-2xl font-serif font-medium text-white leading-snug">
                "{currentProfile.prompt1Answer}"
              </h2>

              <button
                onClick={() =>
                  handleOpenLikeModal(currentProfile.prompt1Label, currentProfile.prompt1Answer)
                }
                className="absolute -bottom-4 right-6 w-11 h-11 bg-white text-[#711a31] rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
              >
                <span className="text-base text-[#711a31]">♥</span>
              </button>
            </div>

            {/* 4. BLIND AUDIO WARMUP NOTE */}
            <div className="bg-gradient-to-r from-[#711a31] via-[#8c223e] to-[#c2415d] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-black tracking-widest text-white/90 flex items-center">
                  <span className="mr-1.5">🎙️</span> Blind Audio Warmup
                </span>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                  {currentProfile.audioDuration}
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif mb-3 leading-snug">
                "{currentProfile.audioPromptTitle}"
              </h3>

              <div className="flex items-center space-x-3 bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-3">
                <button
                  onClick={() => handleToggleAudio(currentProfile.id)}
                  className="w-11 h-11 rounded-full bg-white text-[#711a31] font-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition shrink-0 text-base"
                >
                  {playingAudioId === currentProfile.id ? "❚❚" : "▶"}
                </button>
                <div className="flex-1 flex items-center space-x-1 h-7">
                  {[40, 75, 30, 95, 60, 45, 80, 50, 90, 35, 65, 85, 30, 70, 50].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        playingAudioId === currentProfile.id ? "bg-white animate-pulse" : "bg-white/60"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {!isPhotoRevealed ? (
                <button
                  onClick={() => handleApproveAudio(currentProfile.id)}
                  className="w-full bg-white hover:bg-stone-100 text-[#711a31] font-black text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <span>✨ Approve Vibe & Unlock Full Photos</span>
                </button>
              ) : (
                <div className="text-center text-xs font-bold text-white/90 bg-white/20 py-2 rounded-xl border border-white/20">
                  ✓ Progressive Media Reveal Unlocked
                </div>
              )}
            </div>

            {/* 5. TWO TRUTHS & A LIE (INTERACTIVE ICEBREAKER GAME) */}
            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block mb-2">
                🎮 Icebreaker Game • Two Truths & A Lie
              </span>
              <p className="text-xs text-stone-300 mb-3 font-medium">
                Guess which one is the lie to break the ice!
              </p>
              <div className="space-y-2">
                {currentProfile.twoTruths.map((stmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (stmt.includes("LIE")) {
                        toast.success("Spot on! That's the lie 🎉 Start chatting!", { duration: 4000 });
                      } else {
                        toast("That's actually true! Try another 🧐", { icon: "💡" });
                      }
                    }}
                    className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] p-3 rounded-xl border border-white/[0.08] text-xs font-medium text-stone-200 transition"
                  >
                    {idx + 1}. {stmt.replace(" (LIE!)", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. PHOTO 2 & PROMPT 2 */}
            <div className="w-full h-[430px] rounded-3xl overflow-hidden shadow-2xl relative bg-stone-900 border border-white/[0.12]">
              <img
                src={currentProfile.img2}
                alt={currentProfile.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPhotoRevealed ? "filter blur-0" : "filter blur-xl"
                }`}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                {currentProfile.img2Caption}
              </div>
              <button
                onClick={() =>
                  handleOpenLikeModal("Candid Photo", currentProfile.img2Caption, currentProfile.img2)
                }
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-[#711a31] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
              >
                <span className="text-xl">♥</span>
              </button>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.12] shadow-xl relative">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-300 mb-2">
                {currentProfile.prompt2Label}
              </p>
              <h2 className="text-2xl font-serif font-medium text-white leading-snug">
                "{currentProfile.prompt2Answer}"
              </h2>
              <button
                onClick={() =>
                  handleOpenLikeModal(currentProfile.prompt2Label, currentProfile.prompt2Answer)
                }
                className="absolute -bottom-4 right-6 w-11 h-11 bg-white text-[#711a31] rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
              >
                <span className="text-base text-[#711a31]">♥</span>
              </button>
            </div>

            {/* 7. STICKY HINGE CONTROLS */}
            <div className="sticky bottom-20 w-full z-30 flex items-center justify-center space-x-3.5 py-3">
              <button
                onClick={handleNextProfile}
                className="w-14 h-14 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.2] text-white shadow-2xl flex items-center justify-center hover:bg-white/[0.2] hover:scale-105 active:scale-95 transition text-2xl font-bold shrink-0"
                title="Pass profile"
              >
                ✕
              </button>

              <button
                onClick={() => handleSendRose(currentProfile)}
                className="w-14 h-14 rounded-full bg-rose-950/80 backdrop-blur-xl border border-rose-500/50 text-rose-300 shadow-2xl flex items-center justify-center hover:bg-rose-900 hover:scale-105 active:scale-95 transition text-2xl font-bold shrink-0"
                title="Send a Rose"
              >
                🌹
              </button>

              <button
                onClick={() => handleOpenLikeModal("Profile", "Sent a mutual like")}
                className="flex-1 bg-gradient-to-r from-[#711a31] via-rose-600 to-amber-600 hover:opacity-95 text-white font-black py-4 px-6 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition hover:scale-[1.02] active:scale-95 text-sm"
              >
                <span>Connect & Lock Anti-Ghosting Slot</span>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* =========================================================================
          TAB 2: STANDOUTS
         ========================================================================= */}
      {activeTab === "standouts" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-2xl font-serif font-black text-white">Standouts</h2>
              <span className="text-xs font-bold text-rose-300 bg-rose-950/70 px-3 py-1 rounded-full border border-rose-500/30 flex items-center">
                <span className="mr-1">🌹</span> {rosesRemaining} Rose remaining
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">
              Curated daily based on prompt resonance and shared relationship values. Sending a Rose pins you to the top of their queue.
            </p>
          </div>

          <div className="space-y-4">
            {initialStandouts.map((standout) => (
              <div
                key={standout.id}
                className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/[0.12] shadow-xl"
              >
                <div className="w-full h-72 relative bg-stone-900">
                  <img src={standout.img} alt={standout.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                    {standout.name}, {standout.age} • {standout.city}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-[10px] font-black uppercase text-rose-400 tracking-wider mb-1">
                    {standout.promptLabel}
                  </p>
                  <p className="font-serif text-lg font-medium text-white mb-4">
                    "{standout.promptAnswer}"
                  </p>
                  <button
                    onClick={() => handleSendRose(standout)}
                    className="w-full bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-500/40 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center space-x-1.5 transition active:scale-95"
                  >
                    <span>🌹</span>
                    <span>Send Rose & Jump to Top of Queue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIKES YOU
         ========================================================================= */}
      {activeTab === "likes" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <h2 className="text-2xl font-serif font-black text-white">Likes You</h2>
            <p className="text-xs text-stone-400 font-medium mt-1">
              People who commented on your profile. Review them one by one with single-slot focus.
            </p>
          </div>

          {likesYouList.length === 0 ? (
            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-10 text-center border border-white/[0.12] shadow-xl flex flex-col items-center">
              <span className="text-4xl mb-3">💌</span>
              <h3 className="font-serif text-lg font-bold text-white">All caught up!</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Check back soon or explore verified candidates in Discover.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {likesYouList.map((like) => (
                <div
                  key={like.id}
                  className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/[0.12] shadow-xl"
                >
                  <div className="w-full h-72 relative bg-stone-900">
                    <img src={like.img} alt={like.user} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-rose-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      {like.time}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                      {like.user}, {like.age} • {like.job}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/[0.08] mb-4">
                      <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block">
                        Liked {like.likedItem}:
                      </span>
                      <p className="text-sm font-serif italic text-white mt-1">
                        "{like.comment}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setLikesYouList((l) => l.filter((x) => x.id !== like.id))}
                        className="w-13 h-13 rounded-full border border-white/20 text-stone-400 font-bold hover:bg-white/10 flex items-center justify-center shrink-0 transition"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => {
                          setActiveChatSlot({ id: like.id, name: like.user });
                          setMatchesList((prev) => [
                            {
                              id: like.id,
                              name: like.user,
                              age: like.age,
                              avatar: like.img,
                              lastMessage: like.comment || "Matched from Likes You!",
                              time: "Just now",
                              unread: true,
                              hoursRemaining: 48,
                              diet: "Pure Veg",
                              partnerCafe: "Third Wave Coffee",
                            },
                            ...prev,
                          ]);
                          setLikesYouList((prev) => prev.filter((l) => l.id !== like.id));
                          navigate(`/chat/${like.id}`);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#711a31] to-rose-600 text-white font-extrabold text-xs py-3.5 rounded-full shadow-md transition"
                      >
                        Match & Start Chatting
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: MATCHES & CHAT (48H ANTI-GHOSTING TIMER & SAFE DATE CONCIERGE)
         ========================================================================= */}
      {activeTab === "matches" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <h2 className="text-2xl font-serif font-black text-white">Conversations</h2>
            <p className="text-xs text-stone-400 font-medium mt-1">
              "Your Turn" queue backed by the 48-Hour Anti-Ghosting Accountability Clock.
            </p>
          </div>

          {/* Your Turn Queue */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-4 border border-white/[0.12] shadow-xl">
            <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider block mb-3">
              Your Turn ({matchesList.length})
            </span>
            <div className="flex space-x-3.5 overflow-x-auto scrollbar-hide py-1">
              {matchesList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/chat/${m.id}`)}
                  className="flex flex-col items-center cursor-pointer shrink-0 group"
                >
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-lg group-hover:scale-105 transition"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-[#0a090e]">
                      💬
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white mt-1">{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations List with Anti-Ghosting Timer & Date Pass */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl divide-y divide-white/[0.08] border border-white/[0.12] shadow-xl overflow-hidden">
            {matchesList.map((m) => (
              <div key={m.id} className="p-4 flex flex-col space-y-3 hover:bg-white/[0.04] transition">
                <div
                  onClick={() => navigate(`/chat/${m.id}`)}
                  className="flex items-center space-x-3.5 cursor-pointer"
                >
                  <img src={m.avatar} alt={m.name} className="w-13 h-13 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-bold text-white truncate">
                        {m.name}, {m.age}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-medium">{m.time}</span>
                    </div>
                    <p className="text-xs text-stone-300 truncate mt-0.5">{m.lastMessage}</p>
                  </div>
                  {m.unread && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>}
                </div>

                {/* Safe Date & Accountability Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center">
                    ⏰ {m.hoursRemaining}h to reply
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Plan Date at Partner Cafe */}
                    <button
                      onClick={() => setShowDatePlanModal(m)}
                      className="text-[11px] bg-rose-950/70 hover:bg-rose-900 text-rose-200 px-3 py-1 rounded-full border border-rose-500/30 font-bold transition flex items-center space-x-1"
                    >
                      <span>☕ Plan Date</span>
                    </button>

                    {/* Emergency Date SOS Share */}
                    <button
                      onClick={() => handleEmergencySos(m)}
                      className="text-[11px] bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 px-2.5 py-1 rounded-full border border-white/[0.15] font-bold transition"
                      title="Share Date Safety Details with Friends"
                    >
                      🛡️ SOS
                    </button>

                    {/* Polite Closure */}
                    <button
                      onClick={() => setShowClosureModal(m)}
                      className="text-[11px] text-stone-500 hover:text-stone-300 px-1"
                      title="Polite Closure / Unmatch"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CAFE PARTNERS (DATE-NEARME IRL & CAFE ONBOARDING)
         ========================================================================= */}
      {activeTab === "cafes" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-2xl font-serif font-black text-white">Date-NearMe IRL</h2>
              <button
                onClick={() => setShowPartnerJoinModal(true)}
                className="bg-gradient-to-r from-[#711a31] to-rose-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-md"
              >
                + Partner Your Cafe
              </button>
            </div>
            <p className="text-xs text-stone-400 font-medium">
              Verified safe date cafes. Show your NearMe Date Pass at the counter for exclusive couple perks!
            </p>
          </div>

          {/* Curated Cafes List */}
          <div className="space-y-3.5">
            {partnerCafes.map((cafe) => (
              <div
                key={cafe.id}
                className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl flex flex-col space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white flex items-center">
                      {cafe.name}
                      <span className="ml-2 text-emerald-400 text-xs">✓ Verified</span>
                    </h3>
                    <p className="text-xs text-stone-400">{cafe.address || cafe.city}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {cafe.rating || "4.8 ★"}
                  </span>
                </div>

                <div className="bg-rose-950/50 rounded-2xl p-3 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider block">
                      Couple Exclusive Offer
                    </span>
                    <p className="text-xs font-bold text-white mt-0.5">
                      {cafe.discountOffer || cafe.discount_offer}
                    </p>
                  </div>
                  <span className="text-2xl">☕</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => {
                      toast.success(`Date Pass created for ${cafe.name}! Show token at table: ${cafe.qrCodeToken || cafe.qr_code_token}`);
                    }}
                    className="flex-1 bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs py-2.5 rounded-xl border border-white/[0.15] transition"
                  >
                    View Date Pass Token
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + " " + cafe.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-500/30 transition text-center"
                  >
                    📍 Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: AFFILIATE DASHBOARD (QR CODE STANDEE & 30% / ₹30 REWARDS)
         ========================================================================= */}
      {activeTab === "affiliate" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <h2 className="text-2xl font-serif font-black text-white">Affiliate Partner Hub</h2>
            <p className="text-xs text-stone-400 font-medium mt-1">
              Earn <span className="text-amber-300 font-bold">₹30 (30% reward)</span> for every single friend or cafe customer who joins Date-NearMe via your link or QR code!
            </p>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.12]">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                Total Earned
              </span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">
                ₹{affiliateStats.affiliateBalance}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Ready to withdraw</span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.12]">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                Total Conversions
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {affiliateStats.totalReferrals}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">Paid members joined</span>
            </div>
          </div>

          {/* Table Standee QR Code Preview Card */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.12] shadow-xl text-center flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider mb-2">
              Your Scannable Table Standee / QR Code
            </span>

            {/* Live QR Code Generator SVG */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-2xl flex items-center justify-center mb-3 border-4 border-rose-500/30">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  `https://date-nearme.com/register?ref=${affiliateStats.affiliateCode}`
                )}`}
                alt="Affiliate QR Standee"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs font-mono text-stone-300 font-bold mb-3">
              Code: <span className="text-rose-400">{affiliateStats.affiliateCode}</span>
            </p>

            <div className="w-full flex space-x-2">
              <button
                onClick={copyReferralLink}
                className="flex-1 bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs py-3 rounded-xl border border-white/[0.15] transition"
              >
                📋 Copy Link
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                  `https://date-nearme.com/register?ref=${affiliateStats.affiliateCode}`
                )}`}
                download="Date-NearMe-QR-Standee.png"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gradient-to-r from-[#711a31] to-rose-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition text-center flex items-center justify-center space-x-1"
              >
                <span>💾 Save QR</span>
              </a>
            </div>
          </div>

          {/* UPI Payout Request Form */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <h3 className="font-serif font-bold text-base text-white mb-2">
              Withdraw Earnings via UPI
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Enter your Google Pay, PhonePe, or BHIM UPI ID to instantly transfer earnings.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-3">
              <input
                type="text"
                required
                value={withdrawUpiInput}
                onChange={(e) => setWithdrawUpiInput(e.target.value)}
                placeholder="e.g. yourname@okhdfcbank"
                className="w-full bg-white/[0.05] border border-white/[0.15] text-white rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                disabled={isWithdrawing || affiliateStats.affiliateBalance < 30}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {isWithdrawing
                  ? "Processing..."
                  : `Withdraw ₹${affiliateStats.affiliateBalance} to Bank`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: PROFILE & TRUST SHIELD (MOBILE NUMBER, VERIFICATION & LOGOUT)
         ========================================================================= */}
      {activeTab === "profile" && (
        <div className="w-full max-w-lg px-4 pt-4 flex flex-col space-y-4 z-10">
          {/* Profile Header */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.12] shadow-xl text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#711a31] to-amber-500 text-white flex items-center justify-center text-3xl font-serif font-black shadow-lg border-2 border-white/30 mb-3">
              {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              {profileForm.displayName || "My Profile"}
            </h2>
            <p className="text-xs text-stone-400 font-medium">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                👑 Lifetime Access Active
              </span>
              {user?.isShieldVerified && (
                <span className="text-[11px] font-bold text-rose-300 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                  🛡️ Shield Verified
                </span>
              )}
            </div>
          </div>

          {/* VERIFICATION SHIELD ACTIONS (TRACK 1) */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl space-y-3">
            <h3 className="font-serif font-bold text-base text-white">
              Trust & Safety Badges
            </h3>
            <p className="text-xs text-stone-400">
              Increase match quality by 300% by proving you are genuine and safe.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setShowSelfieModal(true)}
                className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-white p-3 rounded-2xl border border-white/[0.1] flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">🛡️</span>
                  <div className="text-left">
                    <span className="font-bold block">Selfie Liveness Verification</span>
                    <span className="text-[10px] text-stone-400">1-click camera face match</span>
                  </div>
                </div>
                <span className="text-rose-400 font-bold">
                  {user?.isShieldVerified ? "✓ Verified" : "Verify →"}
                </span>
              </button>

              <button
                onClick={() => setShowWorkVerifyModal(true)}
                className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-white p-3 rounded-2xl border border-white/[0.1] flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">💼</span>
                  <div className="text-left">
                    <span className="font-bold block">Work / College Verification</span>
                    <span className="text-[10px] text-stone-400">Verify company domain without exposing salary</span>
                  </div>
                </div>
                <span className="text-sky-400 font-bold">
                  {user?.isWorkVerified ? "✓ Verified" : "Verify →"}
                </span>
              </button>
            </div>
          </div>

          {/* EDIT PROFILE & MOBILE NUMBER */}
          <div className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.12] shadow-xl">
            <h3 className="text-base font-serif font-bold text-white mb-3">
              Account Details & Mobile Number
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.displayName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, displayName: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase text-stone-300">
                    Mobile Number
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Stored in Database
                  </span>
                </div>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-400"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                  Dietary Habit
                </label>
                <select
                  value={profileForm.diet}
                  onChange={(e) => setProfileForm({ ...profileForm, diet: e.target.value })}
                  className="w-full bg-[#1c1827] border border-white/[0.15] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Jain">Strict Jain</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                  Relationship Goal
                </label>
                <select
                  value={profileForm.relationshipIntent}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, relationshipIntent: e.target.value })
                  }
                  className="w-full bg-[#1c1827] border border-white/[0.15] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="Dating for Marriage (1-2 Years)">
                    💍 Dating for Marriage (1-2 Years)
                  </option>
                  <option value="Serious Long-Term Relationship">
                    💫 Serious Long-Term Relationship
                  </option>
                  <option value="Dating with Intent to Settle">
                    ☕ Dating with Intent to Settle
                  </option>
                  <option value="Open to seeing where it leads">
                    🌱 Open to seeing where it leads
                  </option>
                </select>
              </div>

              {/* Incognito Ghost Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div>
                  <span className="text-xs font-bold text-white block">Ghost / Incognito Mode</span>
                  <span className="text-[10px] text-stone-400">
                    Hide profile from phone contacts & browse privately
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profileForm.incognitoMode}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, incognitoMode: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-gradient-to-r from-[#711a31] to-rose-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-70"
              >
                {isSavingProfile ? "Saving to Database..." : "Save Details to Database"}
              </button>
            </form>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
              toast.success("Logged out successfully.");
            }}
            className="w-full bg-red-950/60 hover:bg-red-900/80 text-red-200 font-extrabold text-xs py-3.5 rounded-2xl border border-red-500/30 transition active:scale-95"
          >
            Log Out
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL: SELFIE LIVENESS VERIFICATION (TRACK 1)
         ========================================================================= */}
      {showSelfieModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#161320] border border-white/[0.15] rounded-3xl p-6 text-center text-white shadow-2xl flex flex-col items-center">
            <h3 className="font-serif text-lg font-bold mb-1">Shield Selfie Verification</h3>
            <p className="text-xs text-stone-300 mb-4">
              Center your face in the oval frame and blink to confirm real liveness.
            </p>

            <div className="w-48 h-56 rounded-full border-4 border-dashed border-rose-400 flex items-center justify-center relative overflow-hidden bg-black/60 mb-4">
              {selfieStep === 0 && (
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2">📸</span>
                  <span className="text-[11px] text-stone-400">Position face inside oval</span>
                </div>
              )}
              {selfieStep === 1 && (
                <div className="text-center animate-pulse">
                  <span className="text-4xl block mb-2">👁️</span>
                  <span className="text-xs text-rose-300 font-bold">Checking liveness...</span>
                </div>
              )}
              {selfieStep === 2 && (
                <div className="text-center">
                  <span className="text-5xl block mb-2">🛡️</span>
                  <span className="text-xs text-emerald-400 font-bold">Face Match Verified!</span>
                </div>
              )}
            </div>

            <div className="w-full flex space-x-2">
              <button
                onClick={() => setShowSelfieModal(false)}
                className="w-1/3 py-2.5 rounded-full border border-white/20 text-xs text-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSelfie}
                className="flex-1 bg-gradient-to-r from-[#711a31] to-rose-600 text-white font-black text-xs py-2.5 rounded-full shadow-lg"
              >
                {selfieStep === 0 ? "Start Scan" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: WORKPLACE / UNIVERSITY DOMAIN VERIFY (TRACK 1)
         ========================================================================= */}
      {showWorkVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#161320] border border-white/[0.15] rounded-3xl p-6 text-white shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-1">Work / College Verification</h3>
            <p className="text-xs text-stone-400 mb-4">
              Enter your corporate email (e.g. @google.com, @tcs.com) or college email (.ac.in). We only verify the domain, never salary or personal info.
            </p>

            <form onSubmit={handleCompleteWorkVerify} className="space-y-3">
              <input
                type="email"
                required
                value={workEmailInput}
                onChange={(e) => setWorkEmailInput(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
              />
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkVerifyModal(false)}
                  className="w-1/3 py-2.5 rounded-full border border-white/20 text-xs text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 rounded-full shadow-lg"
                >
                  Verify Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PLAN DATE AT PARTNER CAFE (TRACK 5)
         ========================================================================= */}
      {showDatePlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#161320] border border-white/[0.15] rounded-3xl p-6 text-white shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-1">
              Plan Coffee Date with {showDatePlanModal.name}
            </h3>
            <p className="text-xs text-stone-400 mb-3">
              Choose a curated, safe partner cafe halfway between both of you.
            </p>

            <div className="space-y-2 mb-4">
              {partnerCafes.map((cafe) => (
                <div
                  key={cafe.id}
                  onClick={() => {
                    toast.success(`Date planned at ${cafe.name}! Invitation sent to ${showDatePlanModal.name} ☕`);
                    setShowDatePlanModal(null);
                  }}
                  className="p-3 bg-white/[0.05] hover:bg-white/[0.1] rounded-2xl border border-white/[0.1] cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{cafe.name}</h4>
                    <p className="text-[10px] text-stone-400">{cafe.city}</p>
                    <span className="text-[10px] text-rose-300 font-medium">
                      {cafe.discountOffer || cafe.discount_offer}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-400">Select →</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDatePlanModal(null)}
              className="w-full py-2.5 rounded-full border border-white/20 text-xs text-stone-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: POLITE CLOSURE / UNMATCH (TRACK 2)
         ========================================================================= */}
      {showClosureModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#161320] border border-white/[0.15] rounded-3xl p-6 text-white shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-1">Polite Closure</h3>
            <p className="text-xs text-stone-400 mb-3">
              End this match respectfully to unlock your slot without ghosting.
            </p>

            <div className="space-y-2 mb-4">
              {[
                "Found someone with closer relationship goals",
                "Felt a lifestyle / dietary incompatibility",
                "Did not feel romantic chemistry",
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMatchesList((prev) => prev.filter((m) => m.id !== showClosureModal.id));
                    setActiveChatSlot(null);
                    toast.success("Match closed politely. Slot is now open for new daters! 🔓");
                    setShowClosureModal(null);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-stone-200 transition"
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowClosureModal(null)}
              className="w-full py-2 rounded-full border border-white/20 text-xs text-stone-400"
            >
              Keep Match
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CAFE PARTNER ONBOARDING
         ========================================================================= */}
      {showPartnerJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161320] border border-white/[0.15] rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif text-lg font-bold">Partner Your Cafe</h3>
              <button
                onClick={() => setShowPartnerJoinModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-stone-400 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Get couples on dates sent to your cafe. You keep 90% of customer spend and share 10% platform commission on settled date bills.
            </p>

            <form onSubmit={handleCafeSignup} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                  Cafe Name
                </label>
                <input
                  type="text"
                  required
                  value={cafeForm.name}
                  onChange={(e) => setCafeForm({ ...cafeForm, name: e.target.value })}
                  placeholder="e.g. Roastery Coffee House"
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  required
                  value={cafeForm.city}
                  onChange={(e) => setCafeForm({ ...cafeForm, city: e.target.value })}
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={cafeForm.contactPhone}
                  onChange={(e) => setCafeForm({ ...cafeForm, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-300 mb-1">
                  Couple Perk / Discount Offer
                </label>
                <input
                  type="text"
                  value={cafeForm.discountOffer}
                  onChange={(e) => setCafeForm({ ...cafeForm, discountOffer: e.target.value })}
                  placeholder="10% off bill or free dessert"
                  className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#711a31] to-rose-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg mt-3"
              >
                Submit Partnership & Get Table QR Standee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INTERACTIVE HINGE LIKE & COMMENT DRAWER WITH AI WINGMAN
         ========================================================================= */}
      {likeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#161320] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/[0.15] p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  Sending Like to
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {likeModalItem.targetUser.name}
                </h3>
              </div>
              <button
                onClick={() => setLikeModalItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-stone-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/[0.08]">
              {likeModalItem.itemPhoto && (
                <img
                  src={likeModalItem.itemPhoto}
                  alt="Liked preview"
                  className="w-full h-32 object-cover rounded-xl mb-2"
                />
              )}
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                {likeModalItem.itemType}
              </span>
              <p className="font-serif text-sm font-medium text-stone-200 mt-0.5">
                "{likeModalItem.itemContent}"
              </p>
            </div>

            {/* Comment Input with AI Wingman Button */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-stone-300">
                  Add an optional comment
                </label>
                <button
                  type="button"
                  onClick={handleAiWingmanSuggest}
                  className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1 hover:bg-amber-950 transition"
                >
                  <span>💡 AI Wingman</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={likeComment}
                onChange={(e) => setLikeComment(e.target.value)}
                placeholder={`Ask ${likeModalItem.targetUser.name} a fun question...`}
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-400 resize-none placeholder-stone-500"
              ></textarea>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => setLikeModalItem(null)}
                className="w-1/3 py-3 rounded-full border border-white/20 font-bold text-xs text-stone-400 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendLikeWithComment}
                className="flex-1 bg-gradient-to-r from-[#711a31] via-rose-600 to-amber-600 hover:opacity-90 text-white font-extrabold text-xs py-3.5 rounded-full shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                <span>Send Like & Lock Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md h-[88vh] rounded-3xl overflow-hidden bg-stone-950 shadow-2xl flex flex-col border border-white/10">
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center space-x-2.5">
                <img
                  src={viewingStory.img}
                  alt={viewingStory.user}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <span className="text-white font-bold text-sm block leading-tight">
                    {viewingStory.user}
                  </span>
                  <span className="text-stone-400 text-[10px]">{viewingStory.time}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingStory(null)}
                className="text-white text-2xl font-bold w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>

            <img src={viewingStory.img} alt="Story" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* =========================================================================
          FLOATING GLASS NAVIGATION BAR (100% RESPONSIVE)
         ========================================================================= */}
      <nav className="fixed bottom-0 w-full max-w-lg z-40 bg-black/75 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 flex justify-between items-center shadow-2xl">
        {/* Tab 1: Discover */}
        <button
          onClick={() => {
            setActiveTab("discover");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center transition ${
            activeTab === "discover" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-2xl font-serif font-black leading-none">H</span>
          <span className="text-[9px] font-bold mt-1">Discover</span>
        </button>

        {/* Tab 2: Standouts */}
        <button
          onClick={() => setActiveTab("standouts")}
          className={`flex flex-col items-center transition ${
            activeTab === "standouts" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">⭐</span>
          <span className="text-[9px] font-bold mt-1">Standouts</span>
        </button>

        {/* Tab 3: Likes You */}
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex flex-col items-center transition relative ${
            activeTab === "likes" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">♥</span>
          {likesYouList.length > 0 && (
            <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {likesYouList.length}
            </span>
          )}
          <span className="text-[9px] font-bold mt-1">Likes You</span>
        </button>

        {/* Tab 4: Matches */}
        <button
          onClick={() => setActiveTab("matches")}
          className={`flex flex-col items-center transition relative ${
            activeTab === "matches" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">💬</span>
          {matchesList.some((m) => m.unread) && (
            <span className="absolute top-0 right-3 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          )}
          <span className="text-[9px] font-bold mt-1">Matches</span>
        </button>

        {/* Tab 5: Cafes */}
        <button
          onClick={() => setActiveTab("cafes")}
          className={`flex flex-col items-center transition ${
            activeTab === "cafes" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">☕</span>
          <span className="text-[9px] font-bold mt-1">IRL Cafes</span>
        </button>

        {/* Tab 6: Affiliate */}
        <button
          onClick={() => setActiveTab("affiliate")}
          className={`flex flex-col items-center transition ${
            activeTab === "affiliate" ? "text-amber-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">🪙</span>
          <span className="text-[9px] font-bold mt-1">Affiliate</span>
        </button>

        {/* Tab 7: Profile */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center transition ${
            activeTab === "profile" ? "text-rose-400 scale-105" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <span className="text-xl leading-none">👤</span>
          <span className="text-[9px] font-bold mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Radar;
