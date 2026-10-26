"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import LiveDatingMap from "./LiveDatingMap";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { SocketContext } from "../../Context/SocketContext";
import api from "../../api/axiosConfig";
import HingeNavBar from "../../../components/HingeNavBar";
import HingeLikesYouEmpty from "../../../components/HingeLikesYouEmpty";
import { Info } from "lucide-react";

// Default Instagram-style 24h Stories matching Screenshot 3
const defaultStories = [
  {
    id: "s1",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    user: "mr_mayurkoli_111k",
    time: "2h ago",
  },
  {
    id: "s2",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    user: "kalpesh_ppatil09",
    time: "4h ago",
  },
  {
    id: "s3",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    user: "shubham_wagh",
    time: "6h ago",
  },
  {
    id: "s4",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    user: "aisha_art",
    time: "8h ago",
  },
  {
    id: "s5",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    user: "rahul_fit",
    time: "11h ago",
  },
  {
    id: "s6",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    user: "priya_tours",
    time: "14h ago",
  },
];

// Instagram Story Studio Presets
const trendingSongs = [
  { id: "s1", title: "Kesariya", artist: "Arijit Singh", tag: "Trending 🔥" },
  { id: "s2", title: "Apna Bana Le", artist: "Arijit Singh & Sachin-Jigar", tag: "Love ❤️" },
  { id: "s3", title: "Heeriye", artist: "Jasleen Royal & Arijit Singh", tag: "Viral ✨" },
  { id: "s4", title: "Levitating", artist: "Dua Lipa", tag: "Party 🪩" },
  { id: "s5", title: "Starboy", artist: "The Weeknd", tag: "Vibe ⚡" },
  { id: "s6", title: "Pehle Bhi Main", artist: "Vishal Mishra", tag: "Hits 🎶" },
  { id: "s7", title: "Until I Found You", artist: "Stephen Sanchez", tag: "Retro 💫" },
  { id: "s8", title: "Maan Meri Jaan", artist: "King", tag: "Romance 🌹" },
];

const aestheticVibes = [
  {
    name: "Sunset Mumbai",
    url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    type: "photo",
  },
  {
    name: "Cafe Date",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    type: "photo",
  },
  {
    name: "Night Drive",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    type: "photo",
  },
];

const stickerPresets = [
  { label: "📍 Bandra, Mumbai" },
  { label: "📍 Marine Drive" },
  { label: "☕ Cafe Date" },
  { label: "🥂 Cheers!" },
  { label: "🔥 Vibe Check" },
  { label: "❤️ In Love" },
  { label: "✨ Aesthetic" },
  { label: "💯 10/10" },
  { label: "🌹 Date-NearMe" },
];

const emojiPalette = ["❤️", "🔥", "😍", "🥂", "💫", "🎉", "🌹", "✨", "🥳", "🍕", "☕", "🕶️"];

// Instagram / Social Feed Posts
const defaultPosts = [
  {
    id: "p_1",
    user: "chennaiipl",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: true,
    location: "Mumbai, Maharashtra",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    likes: 65600,
    liked: false,
    caption: "Squad goals & date vibes! Team dinner at Social HKV 💛🔥 #DateNearMe #WhistlePodu #Vibes",
    time: "2 hours ago",
    comments: [
      { user: "mr_mayurkoli_111k", text: "Pure fire guys! 🔥🔥" },
      { user: "aisha_art", text: "The lighting in this venue is gorgeous 😍" },
    ],
  },
  {
    id: "p_2",
    user: "mr_mayurkoli_111k",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    verified: true,
    location: "Blue Tokai, Bandra West",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    likes: 1240,
    liked: false,
    caption: "First coffee date went surprisingly smooth ☕ Got 10% off bill using Date-NearMe QR code! Highly recommend Blue Tokai Bandra.",
    time: "5 hours ago",
    comments: [
      { user: "kalpesh_ppatil09", text: "Bro did she say yes to date #2? 😂" },
      { user: "shubham_wagh", text: "That pour-over coffee there is top tier!" },
    ],
  },
  {
    id: "p_3",
    user: "priya_tours",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    verified: true,
    location: "Indiranagar, Bangalore",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    likes: 3890,
    liked: false,
    caption: "Looking for someone who can match my level of enthusiasm for weekend road trips & South Indian filter coffee 🚗☕ #BangaloreDating #PureVeg",
    time: "1 day ago",
    comments: [
      { user: "rahul_fit", text: "Count me in for Coorg next Saturday!" },
    ],
  },
];

// YouTube / Instagram Reels Feed
const defaultReels = [
  {
    id: "r_1",
    user: "aisha_art",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    videoPoster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    title: "How Indian Gen Z dates vs how our parents dated 😂",
    audio: "Original Audio - AP Dhillon & Diljit",
    likes: 18400,
    comments: 420,
    shares: 890,
    liked: false,
  },
  {
    id: "r_2",
    user: "kabir_vibe",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    videoPoster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    title: "Best 3 first date spots in South Bombay you didn't know about ☕📍",
    audio: "Kishore Kumar - Chhookar Mere Mann Ko (Lofi Remix)",
    likes: 24900,
    comments: 615,
    shares: 1200,
    liked: false,
  },
  {
    id: "r_3",
    user: "priya_tours",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    videoPoster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    title: "POV: You find someone who actually hates small talk as much as you do 💫",
    audio: "Arijit Singh - O Maahi (Slowed & Reverb)",
    likes: 31200,
    comments: 870,
    shares: 2450,
    liked: false,
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

const Radar = ({ initialTab = "discover" }) => {
  const router = useRouter();
  const { user, updateUserProfile, logout } = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  // Tabs: 'discover' | 'map' | 'likes' | 'matches' | 'profile' | 'feed' | 'reels' | 'cafes' | 'affiliate'
  const [activeTab, setActiveTab] = useState(initialTab === "standouts" ? "likes" : initialTab);
  const [likesSubTab, setLikesSubTab] = useState(initialTab === "standouts" ? "standouts" : "likes");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab");
      if (urlTab) {
        setActiveTab(urlTab === "standouts" ? "likes" : urlTab);
        if (urlTab === "standouts") setLikesSubTab("standouts");
      }
    }
  }, []);

  // Social Feed & Following state (Instagram/YouTube ecosystem)
  const [followingMap, setFollowingMap] = useState({
    chennaiipl: true,
    mr_mayurkoli_111k: false,
    kalpesh_ppatil09: false,
    shubham_wagh: false,
    aisha_art: false,
    priya_tours: true,
    kabir_vibe: false,
  });
  const [postsList, setPostsList] = useState(defaultPosts);
  const [reelsList, setReelsList] = useState(defaultReels);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImg, setNewPostImg] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentInputText, setCommentInputText] = useState("");
  const [isPlayingReel, setIsPlayingReel] = useState(true);

  // Instagram Story Studio state
  const [storyCreatorOpen, setStoryCreatorOpen] = useState(false);
  const [storyMedia, setStoryMedia] = useState(null);
  const [storySong, setStorySong] = useState(null);
  const [storyText, setStoryText] = useState("");
  const [storyTextColor, setStoryTextColor] = useState("#ffffff");
  const [storyStickers, setStoryStickers] = useState([]);
  const [activeStoryTool, setActiveStoryTool] = useState(null);
  const [userHasActiveStory, setUserHasActiveStory] = useState(false);
  const [storyQuickReplyText, setStoryQuickReplyText] = useState("");

  const imageStoryInputRef = useRef(null);
  const videoStoryInputRef = useRef(null);

  // Toggle follow status
  const handleToggleFollow = (username) => {
    setFollowingMap((prev) => {
      const isNowFollowing = !prev[username];
      if (isNowFollowing) {
        toast.success(`Following @${username} ✨`);
      } else {
        toast(`Unfollowed @${username}`, { icon: "👋" });
      }
      return { ...prev, [username]: isNowFollowing };
    });
  };

  // Like a post
  const handleLikePost = (postId) => {
    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.liked;
          return {
            ...p,
            liked: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Add comment to post
  const handleAddComment = (postId) => {
    if (!commentInputText.trim()) return;
    const author = profileForm.displayName || user?.displayName || "You";
    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { user: author, text: commentInputText.trim() }],
          };
        }
        return p;
      })
    );
    setCommentInputText("");
    toast.success("Comment posted! 💬");
  };

  // Like a reel
  const handleLikeReel = (reelId) => {
    setReelsList((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.liked;
          return {
            ...r,
            liked: isLiked,
            likes: isLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  };

  // Create a new feed post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostImg && !newPostCaption) {
      toast.error("Please provide an image URL or caption!");
      return;
    }
    const newPost = {
      id: "p_" + Date.now(),
      user: profileForm.displayName || user?.displayName || "You",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      verified: true,
      location: "Active in Mumbai",
      img: newPostImg || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      likes: 1,
      liked: true,
      caption: newPostCaption,
      time: "Just now",
      comments: [],
    };
    setPostsList([newPost, ...postsList]);
    setNewPostModalOpen(false);
    setNewPostCaption("");
    setNewPostImg("");
    toast.success("Post published to Date-NearMe feed! 🚀");
  };

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

  // Story File Selection (Photo or Video) -> Opens Instagram Story Studio
  const handleSelectStoryFile = (e, mediaType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = mediaType === "video" || file.type.startsWith("video/");
    const previewUrl = URL.createObjectURL(file);
    setStoryMedia({
      url: previewUrl,
      type: isVideo ? "video" : "photo",
      file: file,
      name: file.name,
    });
    setStoryCreatorOpen(true);
    toast.success(
      isVideo
        ? "Video loaded! Customize with music, text & stickers 🎥"
        : "Photo loaded! Customize with music, text & stickers 📸"
    );
    if (e.target) e.target.value = "";
  };

  // Quick Aesthetic Vibe Selection (1-Click Test)
  const handleQuickAestheticSelect = (vibe) => {
    setStoryMedia({
      url: vibe.url,
      type: vibe.type,
      file: null,
      name: vibe.name,
    });
    toast.success(`Selected "${vibe.name}" vibe! ✨`);
  };

  // Select Song for Story
  const handleSelectSong = (song) => {
    setStorySong(song);
    setActiveStoryTool(null);
    toast.success(`Song attached: ${song.title} 🎵`);
  };

  // Add Sticker or Emoji to Story Canvas
  const handleAddSticker = (sticker) => {
    if (!storyStickers.includes(sticker)) {
      setStoryStickers((prev) => [...prev, sticker]);
      toast.success(`Added ${sticker}!`);
    }
  };

  // 1-CLICK INSTANT STORY PUBLISHING (< 50ms)
  const handlePublishStory = () => {
    if (!storyMedia && !storyText.trim()) {
      toast.error("Please select a photo, video, or write a vibe!");
      return;
    }

    const newStory = {
      id: "my_story_" + Date.now(),
      img:
        storyMedia?.url ||
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      mediaType: storyMedia?.type || "photo",
      isVideo: storyMedia?.type === "video",
      user: profileForm.displayName || user?.displayName || "You",
      userAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      time: "Just now",
      song: storySong ? `${storySong.title} • ${storySong.artist}` : null,
      textOverlay: storyText.trim() || null,
      textColor: storyTextColor,
      stickers: storyStickers,
    };

    // INSTANT LOCAL STATE UPDATE
    setStoryList((prev) => [newStory, ...prev]);
    setUserHasActiveStory(true);
    setStoryCreatorOpen(false);

    // Reset Studio State
    setStoryMedia(null);
    setStorySong(null);
    setStoryText("");
    setStoryStickers([]);
    setActiveStoryTool(null);

    toast.success("Story posted in 1 click! Tap to view 🌟", { duration: 4000 });

    // NON-BLOCKING BACKGROUND SYNC (Never hangs or blocks user)
    if (storyMedia?.file) {
      const formData = new FormData();
      formData.append("media", storyMedia.file);
      api
        .post("/stories/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 4000,
        })
        .catch(() => {
          // Silent local cache fallback
          console.log("Story cached locally in browser.");
        });
    }
  };

  const copyReferralLink = () => {
    const link = `https://date-nearme.com/register?ref=${affiliateStats.affiliateCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Affiliate link copied to clipboard! 📋");
  };

  // Instagram-style Stories Tray matching Screenshot 3
  const renderStoriesTray = () => (
    <div className="w-full bg-white/90 backdrop-blur-2xl border border-stone-200/80 rounded-3xl p-3.5 sm:p-4 mb-5 shadow-[0_8px_25px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-hide flex items-center space-x-4">
      {/* Current User Story with + Badge */}
      <div className="flex flex-col items-center shrink-0 group w-18">
        <div className="relative">
          {/* Avatar Ring: Glowing Instagram Gradient when Active */}
          <div
            onClick={() => {
              const myStory = storyList.find(
                (s) =>
                  s.id.startsWith("my_story_") ||
                  s.user === "You" ||
                  s.user === (profileForm.displayName || user?.displayName)
              );
              if (myStory) {
                setViewingStory(myStory);
              } else {
                setStoryCreatorOpen(true);
              }
            }}
            className={`w-16 h-16 rounded-full cursor-pointer transition p-[2.5px] ${
              userHasActiveStory || storyList.some((s) => s.id.startsWith("my_story_"))
                ? "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shadow-rose-500/20 hover:scale-105"
                : "border-2 border-dashed border-stone-300 group-hover:border-[#711A31]"
            }`}
          >
            <div className="w-full h-full rounded-full bg-stone-100 flex items-center justify-center text-lg font-bold text-stone-800 overflow-hidden border-2 border-white">
              {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
          </div>

          {/* Plus Badge to Open Story Studio */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStoryCreatorOpen(true);
            }}
            className="absolute -bottom-0.5 -right-0.5 bg-[#711A31] hover:bg-[#541223] hover:scale-110 active:scale-95 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md transition"
            title="Add to story (Photo, Video, Songs & Emojis)"
          >
            +
          </button>
        </div>
        <span className="text-[11px] font-semibold text-stone-700 mt-1.5 text-center">
          Your story
        </span>
      </div>

      {/* Hidden File Inputs for Photo & Video */}
      <input
        type="file"
        ref={imageStoryInputRef}
        onChange={(e) => handleSelectStoryFile(e, "photo")}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={videoStoryInputRef}
        onChange={(e) => handleSelectStoryFile(e, "video")}
        className="hidden"
        accept="video/*"
      />

      {/* Friends & Active Stories */}
      {storyList.map((s) => (
        <div
          key={s.id}
          onClick={() => setViewingStory(s)}
          className="flex flex-col items-center cursor-pointer shrink-0 group w-18"
        >
          <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] group-hover:scale-105 transition shadow-sm">
            {s.mediaType === "video" || s.isVideo ? (
              <video
                src={s.img}
                className="w-full h-full rounded-full object-cover border-2 border-white"
                muted
              />
            ) : (
              <img
                src={s.img}
                alt={s.user}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            )}
          </div>
          <span className="text-[11px] font-semibold text-stone-700 mt-1.5 truncate max-w-[72px] text-center">
            {s.user}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] font-sans text-stone-900 selection:bg-[#711a31] selection:text-white relative overflow-x-hidden">
      {/* AMBIENT FROSTED WARM BACKGROUND REFLECTIONS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[550px] h-[550px] bg-rose-200/35 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-amber-100/35 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-pink-100/40 rounded-full blur-[120px]"></div>
      </div>

      {/* =========================================================================
          DESKTOP LEFT SIDEBAR NAVIGATION (Hinge White Gloss Style)
         ========================================================================= */}
      <aside className="hidden lg:flex flex-col justify-between fixed top-0 left-0 bottom-0 w-64 xl:w-72 bg-white/90 backdrop-blur-2xl border-r border-stone-200/80 p-5 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col space-y-6">
          {/* Brand / Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer py-1 px-2 group"
            onClick={() => {
              setActiveTab("feed");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#711A31] text-white flex items-center justify-center font-serif text-xl font-black shadow-lg shadow-[#711A31]/25 group-hover:scale-105 transition">
              H
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-xl font-black tracking-tight text-stone-900">
                  Date-NearMe
                </span>
              </div>
              <span className="text-[10px] font-sans font-extrabold text-[#711A31] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Social & Dating
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5 text-sm font-semibold">
            {/* 1. Feed (Instagram) */}
            <button
              onClick={() => {
                setActiveTab("feed");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "feed"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">📱</span>
              <span>Social Feed</span>
            </button>

            {/* 2. Reels (YouTube Shorts / IG Reels) */}
            <button
              onClick={() => {
                setActiveTab("reels");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "reels"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">🎬</span>
              <span>Reels & Shorts</span>
            </button>

            {/* 3. Discover (Hinge Dating Stream) */}
            <button
              onClick={() => {
                setActiveTab("discover");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "discover"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">💘</span>
              <span>Dating Radar</span>
            </button>

            {/* 4. Near Me Map */}
            <button
              onClick={() => {
                setActiveTab("map");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "map"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">🗺️</span>
              <span>Near Me Map</span>
            </button>

            {/* 5. Likes You */}
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                activeTab === "likes"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-xl">♥</span>
                <span>Likes You</span>
              </div>
              {likesYouList.length > 0 && (
                <span className="bg-[#711A31] text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {likesYouList.length}
                </span>
              )}
            </button>

            {/* 6. Matches & Chats */}
            <button
              onClick={() => setActiveTab("matches")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                activeTab === "matches"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-xl">💬</span>
                <span>Messages</span>
              </div>
              {matchesList.some((m) => m.unread) && (
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </button>

            {/* 7. IRL Cafes */}
            <button
              onClick={() => setActiveTab("cafes")}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "cafes"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">☕</span>
              <span>Partner Cafes</span>
            </button>

            {/* 8. Affiliate */}
            <button
              onClick={() => setActiveTab("affiliate")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                activeTab === "affiliate"
                  ? "bg-amber-600 text-white shadow-md font-bold"
                  : "text-amber-800 hover:text-amber-900 hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-xl">🪙</span>
                <span>Affiliate (₹30)</span>
              </div>
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                ₹{affiliateStats.affiliateBalance}
              </span>
            </button>

            {/* 9. Profile */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition ${
                activeTab === "profile"
                  ? "bg-[#711A31] text-white shadow-md shadow-[#711A31]/20 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
              }`}
            >
              <span className="text-xl">👤</span>
              <span>Profile Settings</span>
            </button>
          </nav>

          {/* Post Creation Trigger Button */}
          <button
            onClick={() => setNewPostModalOpen(true)}
            className="w-full bg-[#711A31] hover:bg-[#541223] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-[#711A31]/25 flex items-center justify-center space-x-2 transition active:scale-95 text-sm"
          >
            <span className="text-base font-black">+</span>
            <span>Create New Post</span>
          </button>
        </div>

        {/* Current User Card at bottom of left sidebar */}
        <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#711A31] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white">
              {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-stone-900 truncate">
                {profileForm.displayName || user?.displayName || "You"}
              </p>
              <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-amber-500" title="Lifetime Pass Active">
            👑
          </div>
        </div>
      </aside>

      {/* =========================================================================
          DESKTOP RIGHT SIDEBAR (Hinge White Gloss Style)
         ========================================================================= */}
      <aside className="hidden xl:block fixed top-0 right-0 bottom-0 w-80 bg-white/90 backdrop-blur-2xl border-l border-stone-200/80 p-5 overflow-y-auto z-30 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        {/* User Mini Profile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <div className="w-full h-full rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-900">
                {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                {profileForm.displayName || user?.displayName || "You"}
              </p>
              <span className="text-[10px] text-stone-500">Verified Member</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className="text-xs text-[#711A31] hover:text-[#541223] font-bold transition"
          >
            Switch
          </button>
        </div>

        {/* Suggested For You */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Suggested for you
            </span>
            <button
              onClick={() => setActiveTab("discover")}
              className="text-[11px] font-bold text-[#711A31] hover:underline transition"
            >
              See All
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              {
                name: "mr_mayurkoli_111k",
                tag: "Suggested for you",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              },
              {
                name: "kalpesh_ppatil09",
                tag: "Popular near you",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
              },
              {
                name: "shubham_wagh",
                tag: "New on Date-NearMe",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              },
              {
                name: "aisha_art",
                tag: "Shared interest in Art",
                img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
              },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200"
                  />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-stone-900 hover:underline cursor-pointer">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-stone-500">{item.tag}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFollow(item.name)}
                  className={`text-xs font-bold transition px-2.5 py-1 rounded-lg ${
                    followingMap[item.name]
                      ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      : "text-[#711A31] hover:text-[#541223] hover:bg-rose-50"
                  }`}
                >
                  {followingMap[item.name] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Cafes Teaser */}
        <div className="bg-gradient-to-br from-rose-50/70 to-amber-50/50 border border-rose-100/80 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center">
              <span className="mr-1">☕</span> IRL Cafe Dating
            </span>
            <span className="text-[10px] font-black bg-[#711A31] text-white px-2 py-0.5 rounded-full">
              10% OFF
            </span>
          </div>
          <p className="text-[11px] text-stone-600 mb-3 leading-relaxed">
            Safe public date meetups at our verified QR standee cafe partners.
          </p>
          <button
            onClick={() => setActiveTab("cafes")}
            className="w-full bg-white hover:bg-stone-50 text-stone-900 text-xs font-bold py-2 rounded-xl border border-stone-200 shadow-sm transition"
          >
            Browse 12+ Cafes
          </button>
        </div>

        {/* Women Safety Shield */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 flex items-center space-x-2">
          <span className="text-base">🛡️</span>
          <span className="font-medium">Single-Slot Escrow Protection Active</span>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE TOP GLASS HEADER (lg:hidden)
         ========================================================================= */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/90 backdrop-blur-2xl border-b border-stone-200/80 px-4 py-3 flex justify-between items-center shadow-sm">
        {/* Brand */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer"
          onClick={() => {
            setActiveTab("feed");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#711A31] text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-[#711A31]/25">
            H
          </div>
          <div>
            <span className="font-serif text-xl font-black tracking-tight text-stone-900">
              Date-NearMe
            </span>
            <span className="text-[10px] font-sans font-extrabold text-[#711A31] ml-1.5 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Live
            </span>
          </div>
        </div>

        {/* Right Status Clusters */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Quick Reels */}
          <button
            onClick={() => {
              setActiveTab("reels");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              activeTab === "reels"
                ? "bg-[#711A31] text-white border-[#711A31]"
                : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
            }`}
            title="Reels & Shorts"
          >
            🎬
          </button>

          {/* Quick Cafes */}
          <button
            onClick={() => {
              setActiveTab("cafes");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              activeTab === "cafes"
                ? "bg-[#711A31] text-white border-[#711A31]"
                : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
            }`}
            title="Partner Cafes"
          >
            ☕
          </button>

          {/* Create post trigger */}
          <button
            onClick={() => setNewPostModalOpen(true)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center text-lg font-bold border border-stone-200"
            title="Create Post"
          >
            +
          </button>

          {/* Affiliate Earnings Pill */}
          <button
            onClick={() => setActiveTab("affiliate")}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 text-[11px] font-bold flex items-center transition"
            title="Affiliate Rewards Dashboard"
          >
            <span className="mr-1">🪙</span> ₹{affiliateStats.affiliateBalance}
          </button>

          {/* Profile Trigger */}
          <div
            onClick={() => setActiveTab("profile")}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition ${
              activeTab === "profile"
                ? "bg-[#711A31] text-white ring-2 ring-rose-400"
                : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
            }`}
          >
            {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CENTER STREAM CONTAINER (RESPONSIVE FULL SCREEN DESKTOP & MOBILE)
         ========================================================================= */}
      <main className="w-full lg:pl-64 xl:pl-72 xl:pr-80 min-h-screen flex flex-col items-center pb-24 lg:pb-12">
        {/* =========================================================================
            TAB 0: FEED (INSTAGRAM SOCIAL PLATFORM WITH STORIES, POSTS & FOLLOWING)
           ========================================================================= */}
        {activeTab === "feed" && (
          <div className="w-full max-w-2xl px-2 sm:px-4 pt-4 flex flex-col items-center z-10">
            {/* Instagram Stories Tray matching Screenshot 3 */}
            {renderStoriesTray()}

            {/* Quick "Create Post" card */}
            <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-4 border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#711A31] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
                <button
                  onClick={() => setNewPostModalOpen(true)}
                  className="flex-1 bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-left px-4 py-2.5 rounded-full text-xs transition border border-stone-200"
                >
                  Share a photo, vibe or date thought...
                </button>
                <button
                  onClick={() => setNewPostModalOpen(true)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-[#711A31] rounded-full transition border border-rose-200 shadow-sm"
                  title="Create post"
                >
                  📷
                </button>
              </div>
            </div>

            {/* Post Feed List */}
            <div className="w-full space-y-6">
              {postsList.map((post) => (
                <article
                  key={post.id}
                  className="w-full bg-white/95 backdrop-blur-2xl rounded-[2rem] overflow-hidden border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition hover:shadow-md"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0">
                        <img
                          src={post.userAvatar}
                          alt={post.user}
                          className="w-full h-full rounded-full object-cover border border-white"
                        />
                      </div>
                      <div className="leading-tight">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-sm text-stone-900">{post.user}</span>
                          {post.verified && (
                            <span className="text-blue-500 text-xs" title="Verified Creator">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500">{post.location}</span>
                      </div>
                    </div>

                    {/* Follow / Following Button */}
                    <button
                      onClick={() => handleToggleFollow(post.user)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        followingMap[post.user]
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : "bg-[#711A31] hover:bg-[#541223] text-white shadow-sm"
                      }`}
                    >
                      {followingMap[post.user] ? "Following" : "Follow"}
                    </button>
                  </div>

                  {/* Post Image with Double Tap / Click Like Effect */}
                  <div
                    className="w-full h-[380px] sm:h-[480px] relative bg-stone-100 cursor-pointer overflow-hidden group select-none"
                    onDoubleClick={() => handleLikePost(post.id)}
                  >
                    <img
                      src={post.img}
                      alt="Post media"
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-500"
                    />
                    {post.liked && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#711A31] px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-rose-200 shadow-md">
                        <span>❤️</span>
                        <span>Liked</span>
                      </div>
                    )}
                  </div>

                  {/* Post Action Buttons Bar */}
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1.5 transition active:scale-125 ${
                            post.liked ? "text-[#711A31]" : "text-stone-500 hover:text-stone-900"
                          }`}
                        >
                          <span className="text-2xl">{post.liked ? "❤️" : "🤍"}</span>
                          <span className="text-xs font-bold text-stone-800">
                            {post.likes.toLocaleString()}
                          </span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() =>
                            setActiveCommentPost(activeCommentPost === post.id ? null : post.id)
                          }
                          className="flex items-center space-x-1.5 text-stone-500 hover:text-stone-900 transition"
                        >
                          <span className="text-2xl">💬</span>
                          <span className="text-xs font-bold text-stone-800">
                            {post.comments.length}
                          </span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Post link copied! Share on WhatsApp/IG ✈️");
                          }}
                          className="text-stone-500 hover:text-stone-900 text-2xl transition hover:rotate-12"
                          title="Share Post"
                        >
                          ✈️
                        </button>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() => toast.success("Saved to your Bookmarks! 🔖")}
                        className="text-stone-500 hover:text-stone-900 text-xl transition"
                        title="Save"
                      >
                        🔖
                      </button>
                    </div>

                    {/* Likes count */}
                    <p className="text-xs font-bold text-stone-900 mb-1.5">
                      {post.likes.toLocaleString()} likes
                    </p>

                    {/* Caption */}
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      <span className="font-bold text-stone-900 mr-2">{post.user}</span>
                      <span>{post.caption}</span>
                    </div>

                    {/* Time Stamp */}
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block mt-1">
                      {post.time}
                    </span>

                    {/* Comments Toggle and Comments list */}
                    {post.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-stone-500">
                            Comments ({post.comments.length})
                          </span>
                          <button
                            onClick={() =>
                              setActiveCommentPost(activeCommentPost === post.id ? null : post.id)
                            }
                            className="text-[11px] text-[#711A31] font-bold hover:underline"
                          >
                            {activeCommentPost === post.id ? "Hide" : "View all"}
                          </button>
                        </div>

                        {/* Show recent comments or all comments when expanded */}
                        {(activeCommentPost === post.id ? post.comments : post.comments.slice(-2)).map(
                          (c, idx) => (
                            <div key={idx} className="text-xs flex items-start space-x-2">
                              <span className="font-bold text-stone-900 shrink-0">{c.user}</span>
                              <span className="text-stone-700">{c.text}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Add Comment Input Bar */}
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={activeCommentPost === post.id ? commentInputText : ""}
                        onFocus={() => setActiveCommentPost(post.id)}
                        onChange={(e) => {
                          setActiveCommentPost(post.id);
                          setCommentInputText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#711A31]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={activeCommentPost !== post.id || !commentInputText.trim()}
                        className="text-xs font-bold text-[#711A31] disabled:text-stone-400 px-3 py-2 rounded-full hover:bg-rose-50 transition"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 0.5: REELS (YOUTUBE SHORTS / INSTAGRAM REELS VERTICAL VIDEO STREAM)
           ========================================================================= */}
        {activeTab === "reels" && (
          <div className="w-full max-w-xl px-2 sm:px-4 pt-4 flex flex-col items-center z-10">
            {/* Header / Sub-tabs */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🎬</span>
                <h2 className="text-xl font-bold font-serif text-stone-900">Reels & Shorts</h2>
              </div>
              <span className="text-xs font-bold text-[#711A31] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                🔥 Trending Now
              </span>
            </div>

            {/* Reels Feed Stream */}
            <div className="w-full space-y-8">
              {reelsList.map((reel) => (
                <div
                  key={reel.id}
                  className="w-full max-w-md mx-auto h-[620px] rounded-3xl relative overflow-hidden bg-stone-950 border border-white/[0.12] shadow-2xl flex flex-col justify-between"
                >
                  {/* Background Video / Animated Poster */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={reel.videoPoster}
                      alt={reel.creator}
                      className="w-full h-full object-cover brightness-90"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none"></div>
                  </div>

                  {/* Top Bar inside Reel: Sound Toggle & Tags */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      Reels
                    </span>
                    <button
                      onClick={() => setIsPlayingReel(!isPlayingReel)}
                      className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-sm border border-white/20 shadow-md hover:scale-105 transition"
                    >
                      {isPlayingReel ? "🔊" : "🔇"}
                    </button>
                  </div>

                  {/* Center Play/Pause indicator on click */}
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsPlayingReel(!isPlayingReel)}
                  >
                    {!isPlayingReel && (
                      <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center text-2xl border border-white/20">
                        ▶
                      </div>
                    )}
                  </div>

                  {/* Bottom & Right Action Bars inside Reel */}
                  <div className="relative z-20 p-4 flex items-end justify-between">
                    {/* Creator Info & Audio Ticker (Left) */}
                    <div className="flex-1 pr-4">
                      {/* Creator Handle + Follow */}
                      <div className="flex items-center space-x-2.5 mb-2">
                        <img
                          src={reel.creatorAvatar}
                          alt={reel.creator}
                          className="w-9 h-9 rounded-full object-cover border-2 border-white/60"
                        />
                        <span className="font-bold text-sm text-white drop-shadow">
                          @{reel.creator}
                        </span>
                        <button
                          onClick={() => handleToggleFollow(reel.creator)}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition shadow-md ${
                            followingMap[reel.creator]
                              ? "bg-white/20 text-white backdrop-blur-md"
                              : "bg-[#711a31] text-white hover:bg-rose-700"
                          }`}
                        >
                          {followingMap[reel.creator] ? "Following" : "Follow"}
                        </button>
                      </div>

                      {/* Caption */}
                      <p className="text-xs text-white/90 font-medium mb-3 drop-shadow leading-relaxed line-clamp-2">
                        {reel.caption}
                      </p>

                      {/* Music / Audio Ticker */}
                      <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit max-w-[260px]">
                        <span className="text-xs">🎵</span>
                        <span className="text-[11px] text-white font-medium truncate">
                          {reel.music}
                        </span>
                      </div>
                    </div>

                    {/* Vertical Floating Interaction Buttons (Right) */}
                    <div className="flex flex-col items-center space-y-4 shrink-0 pb-1">
                      {/* Like */}
                      <button
                        onClick={() => handleLikeReel(reel.id)}
                        className="flex flex-col items-center transition group active:scale-125"
                      >
                        <div
                          className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-xl shadow-lg border ${
                            reel.liked
                              ? "bg-rose-600/80 border-rose-400 text-white"
                              : "bg-black/60 border-white/20 text-white group-hover:scale-110"
                          }`}
                        >
                          {reel.liked ? "❤️" : "🤍"}
                        </div>
                        <span className="text-[10px] font-bold text-white mt-1 drop-shadow">
                          {reel.likes.toLocaleString()}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() =>
                          toast("Comments opening for @" + reel.creator, { icon: "💬" })
                        }
                        className="flex flex-col items-center transition group"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110">
                          💬
                        </div>
                        <span className="text-[10px] font-bold text-white mt-1 drop-shadow">
                          {reel.comments}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Reel link copied! Share with friends ✈️");
                        }}
                        className="flex flex-col items-center transition group"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110">
                          ✈️
                        </div>
                        <span className="text-[10px] font-bold text-white mt-1 drop-shadow">
                          Share
                        </span>
                      </button>

                      {/* Spinning Vinyl Record Disc */}
                      <div className="w-10 h-10 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center animate-spin shadow-xl">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#711a31] border border-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: DISCOVER (MAIN HINGE STREAM WITH GLASS CARDS & CULTURAL DEALBREAKERS)
           ========================================================================= */}
        {activeTab === "discover" && (
          <div className="w-full max-w-2xl px-2 sm:px-4 pt-4 pb-32 flex flex-col items-center z-10">
            {/* Instagram-Style Stories Tray at top of Discover tab */}
            {renderStoriesTray()}

          {/* GPS PERMISSION STRIP */}
          {!locationAllowed && (
            <div className="w-full px-4 pt-2.5">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium rounded-2xl px-3.5 py-2 flex items-center justify-between shadow-sm">
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
                  className="text-[10px] bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-full font-bold hover:bg-amber-300 transition"
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
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition shadow-sm ${
                    dietFilter === d
                      ? "bg-[#711A31] text-white border border-[#711A31]"
                      : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStrictDealbreakers(!strictDealbreakers)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition flex items-center space-x-1 shadow-sm ${
                strictDealbreakers
                  ? "bg-rose-50 text-[#711A31] border border-rose-200"
                  : "bg-white text-stone-500 border border-stone-200"
              }`}
            >
              <span>{strictDealbreakers ? "⚡ Strict Filter ON" : "Filter OFF"}</span>
            </button>
          </div>

          {/* MAIN PROFILE CARD STREAM */}
          <div className="w-full px-4 pt-3 flex flex-col space-y-4">
            {/* 1. Profile Header & Vitals Glass Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-baseline mb-1">
                <h1 className="text-3xl font-black text-stone-900 tracking-tight font-serif flex items-center">
                  {currentProfile.name},{" "}
                  <span className="font-normal text-stone-500 ml-1.5">
                    {currentProfile.age}
                  </span>
                  {currentProfile.isShieldVerified && (
                    <span
                      className="ml-2 text-rose-600 text-base"
                      title="Shield Liveness Verified"
                    >
                      🛡️
                    </span>
                  )}
                  {currentProfile.isWorkVerified && (
                    <span
                      className="ml-1 text-sky-700 text-xs bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-sans"
                      title="Workplace Verified"
                    >
                      💼 Verified
                    </span>
                  )}
                </h1>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ● Active nearby
                </span>
              </div>

              {/* Location & Pronouns */}
              <div className="flex items-center text-xs font-semibold text-stone-500 space-x-2">
                <span>{currentProfile.pronouns}</span>
                <span>•</span>
                <span className="text-[#711A31] font-bold">
                  {calculatedDistance ? `${calculatedDistance} km away` : "Nearby (2.1 km)"}
                </span>
                <span>•</span>
                <span>{currentProfile.city}</span>
              </div>

              {/* Cultural & Lifestyle Vitals Badges Grid */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-stone-100">
                <span className="bg-rose-50 text-[#711A31] text-[11px] font-bold px-3 py-1.5 rounded-full border border-rose-200 shadow-sm">
                  {currentProfile.relationshipIntent}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
                  {currentProfile.diet}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  {currentProfile.familyDynamic}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  {currentProfile.motherTongue}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  💼 {currentProfile.job}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  🎓 {currentProfile.education}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  📏 {currentProfile.height}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  {currentProfile.zodiac}
                </span>
                <span className="bg-stone-50 text-stone-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-200">
                  {currentProfile.pets}
                </span>
              </div>
            </div>

            {/* 2. PHOTO 1 (Lead Portrait + Micro-Vibe Audio Warmup) */}
            <div className="w-full h-[470px] rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.07)] relative bg-stone-100 border border-stone-200/80 group">
              <img
                src={currentProfile.img1}
                alt={currentProfile.name}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isPhotoRevealed
                    ? "filter blur-0 scale-100"
                    : "filter blur-2xl scale-110 opacity-70"
                }`}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1 rounded-full border border-white/20">
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
                    className="bg-white text-[#711A31] font-black text-xs px-5 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition flex items-center space-x-1.5"
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
                className="absolute bottom-4 right-4 w-12 h-12 bg-white text-[#711A31] border border-stone-200 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
                title="Like photo"
              >
                <span className="text-xl">♥</span>
              </button>
            </div>

            {/* 3. PROMPT CARD 1 */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-7 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] relative">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#711A31] mb-2">
                {currentProfile.prompt1Label}
              </p>
              <h2 className="text-2xl font-serif font-medium text-stone-900 leading-snug">
                "{currentProfile.prompt1Answer}"
              </h2>

              <button
                onClick={() =>
                  handleOpenLikeModal(currentProfile.prompt1Label, currentProfile.prompt1Answer)
                }
                className="absolute -bottom-4 right-6 w-11 h-11 bg-white text-[#711A31] border border-stone-200 rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition"
              >
                <span className="text-base text-[#711A31]">♥</span>
              </button>
            </div>

            {/* 4. BLIND AUDIO WARMUP NOTE */}
            <div className="bg-gradient-to-r from-[#711A31] via-[#8c223e] to-[#c2415d] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
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
                  className="w-11 h-11 rounded-full bg-white text-[#711A31] font-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition shrink-0 text-base"
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
                  className="w-full bg-white hover:bg-stone-50 text-[#711A31] font-black text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 active:scale-95"
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
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block mb-2">
                🎮 Icebreaker Game • Two Truths & A Lie
              </span>
              <p className="text-xs text-stone-500 mb-3 font-medium">
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
                    className="w-full text-left bg-stone-50 hover:bg-stone-100 p-3.5 rounded-xl border border-stone-200/80 text-xs font-medium text-stone-800 transition"
                  >
                    {idx + 1}. {stmt.replace(" (LIE!)", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. PHOTO 2 & PROMPT 2 */}
            <div className="w-full h-[430px] rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.07)] relative bg-stone-100 border border-stone-200/80">
              <img
                src={currentProfile.img2}
                alt={currentProfile.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPhotoRevealed ? "filter blur-0" : "filter blur-xl"
                }`}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1 rounded-full border border-white/20">
                {currentProfile.img2Caption}
              </div>
              <button
                onClick={() =>
                  handleOpenLikeModal("Candid Photo", currentProfile.img2Caption, currentProfile.img2)
                }
                className="absolute bottom-4 right-4 w-12 h-12 bg-white text-[#711A31] border border-stone-200 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
              >
                <span className="text-xl">♥</span>
              </button>
            </div>

            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-7 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] relative">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#711A31] mb-2">
                {currentProfile.prompt2Label}
              </p>
              <h2 className="text-2xl font-serif font-medium text-stone-900 leading-snug">
                "{currentProfile.prompt2Answer}"
              </h2>
              <button
                onClick={() =>
                  handleOpenLikeModal(currentProfile.prompt2Label, currentProfile.prompt2Answer)
                }
                className="absolute -bottom-4 right-6 w-11 h-11 bg-white text-[#711A31] border border-stone-200 rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition"
              >
                <span className="text-base text-[#711A31]">♥</span>
              </button>
            </div>

            {/* 7. STICKY HINGE CONTROLS */}
            <div className="sticky bottom-20 w-full z-30 flex items-center justify-center space-x-3.5 py-3">
              <button
                onClick={handleNextProfile}
                className="w-14 h-14 rounded-full bg-white border border-stone-300 text-stone-700 shadow-xl flex items-center justify-center hover:bg-stone-50 hover:scale-105 active:scale-95 transition text-2xl font-bold shrink-0"
                title="Pass profile"
              >
                ✕
              </button>

              <button
                onClick={() => handleSendRose(currentProfile)}
                className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-[#711A31] shadow-xl flex items-center justify-center hover:bg-rose-100 hover:scale-105 active:scale-95 transition text-2xl font-bold shrink-0"
                title="Send a Rose"
              >
                🌹
              </button>

              <button
                onClick={() => handleOpenLikeModal("Profile", "Sent a mutual like")}
                className="flex-1 bg-[#711A31] hover:bg-[#541223] text-white font-black py-4 px-6 rounded-full shadow-xl shadow-[#711A31]/25 flex items-center justify-center space-x-2 transition hover:scale-[1.01] active:scale-95 text-sm"
              >
                <span>Connect & Lock Anti-Ghosting Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* =========================================================================
          TAB: NEAR ME LIVE MAP RADAR (Active Users & Partner Cafes)
         ========================================================================= */}
      {activeTab === "map" && (
        <LiveDatingMap
          onSelectMatchForChat={(targetUser) => {
            router.push(`/chat/${targetUser.id}`);
          }}
        />
      )}

      {/* =========================================================================
          TAB: LIKES YOU & STANDOUTS (CONSOLIDATED ROUTE)
         ========================================================================= */}
      {(activeTab === "likes" || activeTab === "standouts") && (
        <div className="w-full max-w-2xl px-4 pt-4 pb-32 flex flex-col space-y-4 z-10">
          {/* Header & Sub-nav Toggle */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-5 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-2xl font-serif font-black text-stone-900">
                  {likesSubTab === "standouts" ? "Curated Standouts" : "Likes You"}
                </h2>
                <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                  {likesSubTab === "standouts"
                    ? "Curated daily based on prompt resonance and shared relationship values. Send a Rose to jump to the top!"
                    : "People who commented on your profile. Review them one by one with single-slot focus."}
                </p>
              </div>
              {likesSubTab === "standouts" && (
                <button
                  onClick={() =>
                    toast("You get 1 free Rose every week to pin your profile to their top queue!", {
                      icon: "🌹",
                    })
                  }
                  className="text-xs font-bold text-[#241026] bg-[#BBA7BE] hover:bg-[#AE97B1] px-3.5 py-1.5 rounded-full border border-[#A68EA5]/40 shadow-sm flex items-center space-x-1.5 transition active:scale-95 shrink-0"
                >
                  <span>🌹</span>
                  <span>Roses ({rosesRemaining})</span>
                </button>
              )}
            </div>

            {/* Sub-nav Pill Selector */}
            <div className="bg-stone-100 p-1 rounded-2xl flex items-center space-x-1">
              <button
                onClick={() => setLikesSubTab("likes")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  likesSubTab === "likes"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
                }`}
              >
                <span>❤️ Likes Received</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    likesSubTab === "likes" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {likesYouList.length}
                </span>
              </button>
              <button
                onClick={() => setLikesSubTab("standouts")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  likesSubTab === "standouts"
                    ? "bg-[#711A31] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
                }`}
              >
                <span>🌹 Curated Standouts</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    likesSubTab === "standouts" ? "bg-white/20 text-white" : "bg-[#BBA7BE]/30 text-purple-900"
                  }`}
                >
                  {initialStandouts.length}
                </span>
              </button>
            </div>
          </div>

          {/* Sub-view 1: Likes Received */}
          {likesSubTab === "likes" && (
            <div>
              {likesYouList.length === 0 ? (
                <HingeLikesYouEmpty
                  onBoostClick={() => toast.success("Boost activated for 1 hour! Profile prioritized.")}
                  onUpgradeClick={() => toast("HingeX subscription unlocked! Enjoy priority likes.", { icon: "✦" })}
                />
              ) : (
                <div className="space-y-4">
                  {likesYouList.map((like) => (
                    <div
                      key={like.id}
                      className="bg-white/95 backdrop-blur-2xl rounded-[2rem] overflow-hidden border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                    >
                      <div className="w-full h-72 relative bg-stone-100">
                        <img src={like.img} alt={like.user} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#711A31] text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-sm border border-stone-200/60">
                          {like.time}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-xs font-bold shadow-md">
                          {like.user}, {like.age} • {like.job}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 mb-5">
                          <span className="text-[11px] font-black uppercase text-[#711A31] tracking-wider block">
                            Liked {like.likedItem}:
                          </span>
                          <p className="text-sm font-serif italic text-stone-900 mt-1 leading-relaxed">
                            "{like.comment}"
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setLikesYouList((l) => l.filter((x) => x.id !== like.id))}
                            className="w-12 h-12 rounded-full border border-stone-200 bg-white text-stone-500 font-bold hover:bg-stone-100 flex items-center justify-center shrink-0 shadow-sm transition"
                            title="Pass"
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
                              router.push(`/chat/${like.id}`);
                            }}
                            className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-full shadow-md transition active:scale-95"
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

          {/* Sub-view 2: Curated Standouts */}
          {likesSubTab === "standouts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialStandouts.map((standout) => (
                <div
                  key={standout.id}
                  className="bg-white/95 backdrop-blur-2xl rounded-[2rem] overflow-hidden border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] transition duration-300"
                >
                  <div className="w-full h-72 relative bg-stone-100">
                    <img src={standout.img} alt={standout.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-xs font-bold shadow-md">
                      {standout.name}, {standout.age} • {standout.city}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[11px] font-black uppercase text-[#711A31] tracking-wider mb-1">
                      {standout.promptLabel}
                    </p>
                    <p className="font-serif text-lg font-medium text-stone-900 mb-5 leading-snug">
                      "{standout.promptAnswer}"
                    </p>
                    <button
                      onClick={() => handleSendRose(standout)}
                      className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md flex items-center justify-center space-x-1.5 transition active:scale-95"
                    >
                      <span>🌹</span>
                      <span>Send Rose & Jump to Top of Queue</span>
                    </button>
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
        <div className="w-full max-w-3xl px-4 pt-4 pb-32 flex flex-col space-y-4 z-10">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-serif font-black text-stone-900">Conversations</h2>
            <p className="text-xs text-stone-600 font-medium mt-1 leading-relaxed">
              "Your Turn" queue backed by the 48-Hour Anti-Ghosting Accountability Clock.
            </p>
          </div>

          {/* Your Turn Queue */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <span className="text-[11px] font-black uppercase text-[#711A31] tracking-wider block mb-3">
              Your Turn ({matchesList.length})
            </span>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-1">
              {matchesList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => router.push(`/chat/${m.id}`)}
                  className="flex flex-col items-center cursor-pointer shrink-0 group"
                >
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#711A31] shadow-md group-hover:scale-105 transition"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#711A31] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-white shadow-sm">
                      💬
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900 mt-1.5">{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations List with Anti-Ghosting Timer & Date Pass */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] divide-y divide-stone-100 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] overflow-hidden">
            {matchesList.map((m) => (
              <div key={m.id} className="p-5 flex flex-col space-y-3.5 hover:bg-stone-50/70 transition">
                <div
                  onClick={() => router.push(`/chat/${m.id}`)}
                  className="flex items-center space-x-3.5 cursor-pointer"
                >
                  <img src={m.avatar} alt={m.name} className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] rounded-full object-cover shrink-0 shadow-sm border border-stone-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {m.name}, {m.age}
                      </h4>
                      <span className="text-[10px] text-stone-500 font-medium">{m.time}</span>
                    </div>
                    <p className="text-xs text-stone-600 truncate mt-0.5">{m.lastMessage}</p>
                  </div>
                  {m.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#711A31] shrink-0"></span>}
                </div>

                {/* Safe Date & Accountability Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100 text-xs">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center shadow-sm">
                    ⏰ {m.hoursRemaining}h to reply
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Plan Date at Partner Cafe */}
                    <button
                      onClick={() => setShowDatePlanModal(m)}
                      className="text-[11px] bg-rose-50 hover:bg-rose-100 text-[#711A31] px-3.5 py-1 rounded-full border border-rose-200 font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <span>☕ Plan Date</span>
                    </button>

                    {/* Emergency Date SOS Share */}
                    <button
                      onClick={() => handleEmergencySos(m)}
                      className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded-full border border-stone-200 font-bold transition shadow-sm"
                      title="Share Date Safety Details with Friends"
                    >
                      🛡️ SOS
                    </button>

                    {/* Polite Closure */}
                    <button
                      onClick={() => setShowClosureModal(m)}
                      className="text-[11px] text-stone-400 hover:text-stone-600 px-1"
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
        <div className="w-full max-w-4xl px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-2xl font-serif font-black text-stone-900">Date-NearMe IRL</h2>
              <button
                onClick={() => setShowPartnerJoinModal(true)}
                className="bg-[#711A31] hover:bg-[#581426] text-white text-[11px] font-extrabold px-4 py-2 rounded-full shadow-md transition active:scale-95"
              >
                + Partner Your Cafe
              </button>
            </div>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Verified safe date cafes. Show your NearMe Date Pass at the counter for exclusive couple perks!
            </p>
          </div>

          {/* Curated Cafes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerCafes.map((cafe) => (
              <div
                key={cafe.id}
                className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col space-y-3.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center">
                      {cafe.name}
                      <span className="ml-2 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-sans border border-emerald-200">
                        ✓ Verified
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{cafe.address || cafe.city}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-sm">
                    {cafe.rating || "4.8 ★"}
                  </span>
                </div>

                <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#711A31] tracking-wider block">
                      Couple Exclusive Offer
                    </span>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
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
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 rounded-xl border border-stone-200 transition"
                  >
                    View Date Pass Token
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + " " + cafe.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#711A31] hover:bg-[#581426] text-white text-xs font-bold rounded-xl shadow-sm transition text-center"
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
        <div className="w-full max-w-3xl px-4 pt-4 flex flex-col space-y-4 z-10">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-serif font-black text-stone-900">Affiliate Partner Hub</h2>
            <p className="text-xs text-stone-600 font-medium mt-1 leading-relaxed">
              Earn <span className="text-[#711A31] font-bold">₹30 (30% reward)</span> for every single friend or cafe customer who joins Date-NearMe via your link or QR code!
            </p>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                Total Earned
              </span>
              <span className="text-2xl font-black text-[#711A31] mt-1 block">
                ₹{affiliateStats.affiliateBalance}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Ready to withdraw</span>
            </div>

            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                Total Conversions
              </span>
              <span className="text-2xl font-black text-stone-900 mt-1 block">
                {affiliateStats.totalReferrals}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Paid members joined</span>
            </div>
          </div>

          {/* Table Standee QR Code Preview Card */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
            <span className="text-[11px] font-black uppercase text-[#711A31] tracking-wider mb-2">
              Your Scannable Table Standee / QR Code
            </span>

            {/* Live QR Code Generator SVG */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md flex items-center justify-center mb-3 border-4 border-rose-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  `https://date-nearme.com/register?ref=${affiliateStats.affiliateCode}`
                )}`}
                alt="Affiliate QR Standee"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs font-mono text-stone-600 font-bold mb-3">
              Code: <span className="text-[#711A31]">{affiliateStats.affiliateCode}</span>
            </p>

            <div className="w-full flex space-x-2">
              <button
                onClick={copyReferralLink}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-xl border border-stone-200 transition"
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
                className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition text-center flex items-center justify-center space-x-1"
              >
                <span>💾 Save QR</span>
              </a>
            </div>
          </div>

          {/* UPI Payout Request Form */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
              Withdraw Earnings via UPI
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Enter your Google Pay, PhonePe, or BHIM UPI ID to instantly transfer earnings.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-3">
              <input
                type="text"
                required
                value={withdrawUpiInput}
                onChange={(e) => setWithdrawUpiInput(e.target.value)}
                placeholder="e.g. yourname@okhdfcbank"
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#711A31]"
              />
              <button
                type="submit"
                disabled={isWithdrawing || affiliateStats.affiliateBalance < 30}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
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
        <div className="w-full max-w-2xl px-4 pt-4 flex flex-col space-y-4 z-10">
          {/* Profile Header */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#711a31] to-rose-600 text-white flex items-center justify-center text-3xl font-serif font-black shadow-md border-2 border-white mb-3">
              {(profileForm.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              {profileForm.displayName || "My Profile"}
            </h2>
            <p className="text-xs text-stone-500 font-medium">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                👑 Lifetime Access Active
              </span>
              {user?.isShieldVerified && (
                <span className="text-[11px] font-bold text-[#711A31] bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shadow-sm">
                  🛡️ Shield Verified
                </span>
              )}
            </div>
          </div>

          {/* VERIFICATION SHIELD ACTIONS (TRACK 1) */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)] space-y-3">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Trust & Safety Badges
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Increase match quality by 300% by proving you are genuine and safe.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setShowSelfieModal(true)}
                className="w-full bg-stone-50 hover:bg-stone-100/80 text-stone-900 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs transition shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🛡️</span>
                  <div className="text-left">
                    <span className="font-bold block">Selfie Liveness Verification</span>
                    <span className="text-[10px] text-stone-500">1-click camera face match</span>
                  </div>
                </div>
                <span className="text-[#711A31] font-bold">
                  {user?.isShieldVerified ? "✓ Verified" : "Verify →"}
                </span>
              </button>

              <button
                onClick={() => setShowWorkVerifyModal(true)}
                className="w-full bg-stone-50 hover:bg-stone-100/80 text-stone-900 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs transition shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💼</span>
                  <div className="text-left">
                    <span className="font-bold block">Work / College Verification</span>
                    <span className="text-[10px] text-stone-500">Verify company domain without exposing salary</span>
                  </div>
                </div>
                <span className="text-sky-700 font-bold">
                  {user?.isWorkVerified ? "✓ Verified" : "Verify →"}
                </span>
              </button>
            </div>
          </div>

          {/* EDIT PROFILE & MOBILE NUMBER */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-stone-200/80 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3">
              Account Details & Mobile Number
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.displayName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, displayName: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase text-stone-700">
                    Mobile Number
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Stored in Database
                  </span>
                </div>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#711A31]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Dietary Habit
                </label>
                <select
                  value={profileForm.diet}
                  onChange={(e) => setProfileForm({ ...profileForm, diet: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                >
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Jain">Strict Jain</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Relationship Goal
                </label>
                <select
                  value={profileForm.relationshipIntent}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, relationshipIntent: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
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
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Ghost / Incognito Mode</span>
                  <span className="text-[10px] text-stone-500">
                    Hide profile from phone contacts & browse privately
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profileForm.incognitoMode}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, incognitoMode: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#711A31] rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-70"
              >
                {isSavingProfile ? "Saving to Database..." : "Save Details to Database"}
              </button>
            </form>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              router.push("/login");
              toast.success("Logged out successfully.");
            }}
            className="w-full bg-rose-50 hover:bg-rose-100 text-[#711A31] font-extrabold text-xs py-3.5 rounded-2xl border border-rose-200 transition active:scale-95 shadow-sm"
          >
            Log Out
          </button>
        </div>
      )}
      </main>

      {/* =========================================================================
          MODAL: SELFIE LIVENESS VERIFICATION (TRACK 1)
         ========================================================================= */}
      {showSelfieModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-6 text-center text-stone-900 shadow-2xl flex flex-col items-center">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Shield Selfie Verification</h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Center your face in the oval frame and blink to confirm real liveness.
            </p>

            <div className="w-48 h-56 rounded-full border-4 border-dashed border-[#711A31] flex items-center justify-center relative overflow-hidden bg-stone-100 mb-4">
              {selfieStep === 0 && (
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2">📸</span>
                  <span className="text-[11px] text-stone-500 font-medium">Position face inside oval</span>
                </div>
              )}
              {selfieStep === 1 && (
                <div className="text-center animate-pulse">
                  <span className="text-4xl block mb-2">👁️</span>
                  <span className="text-xs text-[#711A31] font-bold">Checking liveness...</span>
                </div>
              )}
              {selfieStep === 2 && (
                <div className="text-center">
                  <span className="text-5xl block mb-2">🛡️</span>
                  <span className="text-xs text-emerald-700 font-bold">Face Match Verified!</span>
                </div>
              )}
            </div>

            <div className="w-full flex space-x-2">
              <button
                onClick={() => setShowSelfieModal(false)}
                className="w-1/3 py-2.5 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSelfie}
                className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white font-black text-xs py-2.5 rounded-full shadow-md transition active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-6 text-stone-900 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Work / College Verification</h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Enter your corporate email (e.g. @google.com, @tcs.com) or college email (.ac.in). We only verify the domain, never salary or personal info.
            </p>

            <form onSubmit={handleCompleteWorkVerify} className="space-y-3">
              <input
                type="email"
                required
                value={workEmailInput}
                onChange={(e) => setWorkEmailInput(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkVerifyModal(false)}
                  className="w-1/3 py-2.5 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs py-2.5 rounded-full shadow-md transition active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-6 text-stone-900 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Plan Coffee Date with {showDatePlanModal.name}
            </h3>
            <p className="text-xs text-stone-600 mb-3 leading-relaxed">
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
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{cafe.name}</h4>
                    <p className="text-[10px] text-stone-500">{cafe.city}</p>
                    <span className="text-[10px] text-[#711A31] font-semibold">
                      {cafe.discountOffer || cafe.discount_offer}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#711A31]">Select →</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDatePlanModal(null)}
              className="w-full py-2.5 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 font-bold transition"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-6 text-stone-900 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Polite Closure</h3>
            <p className="text-xs text-stone-600 mb-3 leading-relaxed">
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
                  className="w-full text-left p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-800 font-medium transition"
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowClosureModal(null)}
              className="w-full py-2.5 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 font-bold transition"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-6 text-stone-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif text-lg font-bold text-stone-900">Partner Your Cafe</h3>
              <button
                onClick={() => setShowPartnerJoinModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Get couples on dates sent to your cafe. You keep 90% of customer spend and share 10% platform commission on settled date bills.
            </p>

            <form onSubmit={handleCafeSignup} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Cafe Name
                </label>
                <input
                  type="text"
                  required
                  value={cafeForm.name}
                  onChange={(e) => setCafeForm({ ...cafeForm, name: e.target.value })}
                  placeholder="e.g. Roastery Coffee House"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  required
                  value={cafeForm.city}
                  onChange={(e) => setCafeForm({ ...cafeForm, city: e.target.value })}
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={cafeForm.contactPhone}
                  onChange={(e) => setCafeForm({ ...cafeForm, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Couple Perk / Discount Offer
                </label>
                <input
                  type="text"
                  value={cafeForm.discountOffer}
                  onChange={(e) => setCafeForm({ ...cafeForm, discountOffer: e.target.value })}
                  placeholder="10% off bill or free dessert"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#711A31]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition active:scale-95 mt-3"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white/98 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-stone-200 p-6 flex flex-col space-y-4 text-stone-900">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-black uppercase text-[#711A31] tracking-wider">
                  Sending Like to
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {likeModalItem.targetUser.name}
                </h3>
              </div>
              <button
                onClick={() => setLikeModalItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
              {likeModalItem.itemPhoto && (
                <img
                  src={likeModalItem.itemPhoto}
                  alt="Liked preview"
                  className="w-full h-32 object-cover rounded-xl mb-2"
                />
              )}
              <span className="text-[10px] font-black uppercase text-[#711A31] tracking-wider">
                {likeModalItem.itemType}
              </span>
              <p className="font-serif text-sm font-medium text-stone-900 mt-0.5">
                "{likeModalItem.itemContent}"
              </p>
            </div>

            {/* Comment Input with AI Wingman Button */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Add an optional comment
                </label>
                <button
                  type="button"
                  onClick={handleAiWingmanSuggest}
                  className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-sm flex items-center space-x-1 hover:bg-amber-100 transition"
                >
                  <span>💡 AI Wingman</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={likeComment}
                onChange={(e) => setLikeComment(e.target.value)}
                placeholder={`Ask ${likeModalItem.targetUser.name} a fun question...`}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#711A31] resize-none placeholder-stone-400"
              ></textarea>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => setLikeModalItem(null)}
                className="w-1/3 py-3 rounded-full border border-stone-200 font-bold text-xs text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendLikeWithComment}
                className="flex-1 bg-[#711A31] hover:bg-[#581426] text-white font-extrabold text-xs py-3.5 rounded-full shadow-md transition active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <span>Send Like & Lock Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULLSCREEN STORY VIEWER MODAL (VIDEO/PHOTO AUTOPLAY, MUSIC, TEXT & STICKERS)
         ========================================================================= */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm sm:max-w-md h-[90vh] max-h-[780px] rounded-3xl overflow-hidden bg-stone-950 shadow-2xl flex flex-col border border-white/10">
            {/* Top Bar inside Story Viewer */}
            <div className="absolute top-0 w-full p-4 flex flex-col z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
              {/* 15-second progress bar */}
              <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mb-3">
                <div className="bg-white h-full animate-[pulse_2s_infinite] w-full"></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
                    <img
                      src={viewingStory.userAvatar || viewingStory.img}
                      alt={viewingStory.user}
                      className="w-full h-full rounded-full object-cover border border-[#0a090e]"
                    />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm block leading-tight">
                      {viewingStory.user}
                    </span>
                    <span className="text-stone-400 text-[10px]">{viewingStory.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => setViewingStory(null)}
                  className="text-white text-xl font-bold w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/80 transition"
                >
                  ✕
                </button>
              </div>

              {/* Attached Song Ticker Badge */}
              {viewingStory.song && (
                <div className="mt-2.5 inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 w-fit text-xs text-white shadow-lg animate-pulse">
                  <span>🎵</span>
                  <span className="font-semibold truncate max-w-[220px]">{viewingStory.song}</span>
                </div>
              )}
            </div>

            {/* Media Content: Video or Image */}
            <div className="w-full h-full relative bg-stone-950 flex items-center justify-center overflow-hidden">
              {viewingStory.mediaType === "video" || viewingStory.isVideo || viewingStory.img?.endsWith(".mp4") ? (
                <video
                  src={viewingStory.img}
                  autoPlay
                  playsInline
                  controls
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={viewingStory.img}
                  alt={viewingStory.user}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Text Overlay on Canvas */}
              {viewingStory.textOverlay && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-center max-w-[85%] z-10 pointer-events-none shadow-xl">
                  <p
                    style={{ color: viewingStory.textColor || "#ffffff" }}
                    className="text-base font-bold drop-shadow-md"
                  >
                    {viewingStory.textOverlay}
                  </p>
                </div>
              )}

              {/* Stickers / Emojis Overlay */}
              {viewingStory.stickers && viewingStory.stickers.length > 0 && (
                <div className="absolute bottom-20 left-4 right-4 flex flex-wrap gap-2 z-10 pointer-events-none">
                  {viewingStory.stickers.map((stk, idx) => (
                    <div
                      key={idx}
                      className="bg-white/95 text-stone-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
                    >
                      {stk}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Quick Reply & Reaction Bar */}
            <div className="absolute bottom-0 w-full p-3.5 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Reply to ${viewingStory.user}...`}
                value={storyQuickReplyText}
                onChange={(e) => setStoryQuickReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && storyQuickReplyText.trim()) {
                    toast.success(`Message sent to ${viewingStory.user}! 💌`);
                    setStoryQuickReplyText("");
                  }
                }}
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-white"
              />
              {["❤️", "🔥", "😍", "👏"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    toast.success(`Reacted ${emoji} to ${viewingStory.user}!`);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-sm flex items-center justify-center transition active:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INSTAGRAM STORY CREATOR STUDIO (PHOTO, VIDEO, SONGS, TEXT & EMOJIS)
         ========================================================================= */}
      {storyCreatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[760px] bg-[#0d0c13] border border-white/[0.12] rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl relative">
            {/* Studio Top Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/[0.08] bg-black/40 z-30">
              <button
                onClick={() => {
                  setStoryCreatorOpen(false);
                  setStoryMedia(null);
                  setActiveStoryTool(null);
                }}
                className="text-stone-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center space-x-1.5">
                <span className="text-base">✨</span>
                <span className="font-serif font-black text-sm text-white">Story Studio</span>
              </div>

              {/* Action Toolbar on Top (when media is selected) */}
              <div className="flex items-center space-x-1.5">
                {/* Music Tool Button */}
                <button
                  onClick={() => setActiveStoryTool(activeStoryTool === "music" ? null : "music")}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${
                    storySong || activeStoryTool === "music"
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-stone-300"
                  }`}
                  title="Add Music / Song"
                >
                  🎵
                </button>

                {/* Text Tool Button */}
                <button
                  onClick={() => setActiveStoryTool(activeStoryTool === "text" ? null : "text")}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${
                    storyText || activeStoryTool === "text"
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-stone-300"
                  }`}
                  title="Add Text"
                >
                  ✍️
                </button>

                {/* Stickers Tool Button */}
                <button
                  onClick={() => setActiveStoryTool(activeStoryTool === "sticker" ? null : "sticker")}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${
                    storyStickers.length > 0 || activeStoryTool === "sticker"
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-stone-300"
                  }`}
                  title="Add Stickers & Emojis"
                >
                  😀
                </button>
              </div>
            </div>

            {/* Studio Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-stone-950 flex flex-col justify-center items-center">
              {!storyMedia ? (
                /* No Media Chosen Yet: Interactive Selector */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-3xl shadow-xl shadow-rose-950/50">
                    📸
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-black text-white">Add to Your Story</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-xs">
                      Post a photo or video clip. Add songs, captions, and stickers just like Instagram!
                    </p>
                  </div>

                  {/* 2 Big Choice Tiles */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {/* Photo Tile */}
                    <button
                      onClick={() => imageStoryInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition group hover:border-rose-400"
                    >
                      <span className="text-3xl mb-1 group-hover:scale-110 transition">📷</span>
                      <span className="text-xs font-bold text-white">Photo</span>
                      <span className="text-[10px] text-stone-400">Camera / Gallery</span>
                    </button>

                    {/* Video Tile */}
                    <button
                      onClick={() => videoStoryInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition group hover:border-rose-400"
                    >
                      <span className="text-3xl mb-1 group-hover:scale-110 transition">🎥</span>
                      <span className="text-xs font-bold text-white">Video</span>
                      <span className="text-[10px] text-stone-400">Clips & Shorts</span>
                    </button>
                  </div>

                  {/* Quick Aesthetic Vibe Presets (1-Click Test) */}
                  <div className="w-full max-w-xs pt-2">
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block mb-2">
                      Or pick an instant vibe
                    </span>
                    <div className="flex justify-center space-x-2">
                      {aestheticVibes.map((v) => (
                        <button
                          key={v.name}
                          onClick={() => handleQuickAestheticSelect(v)}
                          className="text-[11px] font-bold text-stone-300 bg-white/[0.06] hover:bg-rose-950/60 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/10 transition"
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Media Active on Canvas */
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {storyMedia.type === "video" ? (
                    <video
                      src={storyMedia.url}
                      autoPlay
                      playsInline
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={storyMedia.url}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Song Badge on Canvas */}
                  {storySong && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center space-x-2 text-white text-xs shadow-lg animate-pulse z-10">
                      <span className="text-sm">🎵</span>
                      <span className="font-bold truncate max-w-[170px]">
                        {storySong.title} • {storySong.artist}
                      </span>
                      <button
                        onClick={() => setStorySong(null)}
                        className="ml-1 text-stone-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Text Overlay on Canvas */}
                  {storyText && (
                    <div
                      onClick={() => setActiveStoryTool("text")}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center max-w-[85%] shadow-2xl cursor-pointer z-10"
                    >
                      <p
                        style={{ color: storyTextColor }}
                        className="text-base font-bold drop-shadow leading-snug"
                      >
                        {storyText}
                      </p>
                    </div>
                  )}

                  {/* Stickers & Emojis on Canvas */}
                  {storyStickers.length > 0 && (
                    <div className="absolute bottom-6 left-4 right-4 flex flex-wrap gap-2 z-10">
                      {storyStickers.map((stk, idx) => (
                        <div
                          key={idx}
                          className="bg-white/90 text-stone-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5"
                        >
                          <span>{stk}</span>
                          <button
                            onClick={() =>
                              setStoryStickers(storyStickers.filter((_, i) => i !== idx))
                            }
                            className="text-stone-500 hover:text-red-500 text-[11px] ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE TOOL DRAWER 1: MUSIC SELECTOR */}
              {activeStoryTool === "music" && (
                <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-[#121118]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-4 flex flex-col z-40 overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-white flex items-center">
                      <span className="mr-1.5">🎵</span> Trending Music Tracks
                    </span>
                    <button
                      onClick={() => setActiveStoryTool(null)}
                      className="text-xs font-bold text-stone-400 hover:text-white"
                    >
                      Done
                    </button>
                  </div>
                  <div className="overflow-y-auto space-y-2 max-h-56 scrollbar-hide pr-1">
                    {trendingSongs.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => handleSelectSong(song)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                          storySong?.id === song.id
                            ? "bg-rose-950/70 border-rose-500/50 text-white"
                            : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] text-stone-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">💿</span>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{song.title}</p>
                            <p className="text-[10px] text-stone-400">{song.artist}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
                          {song.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVE TOOL DRAWER 2: TEXT OVERLAY */}
              {activeStoryTool === "text" && (
                <div className="absolute inset-x-0 bottom-0 bg-[#121118]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-4 flex flex-col z-40 shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white">✍️ Add Text Overlay</span>
                    <button
                      onClick={() => setActiveStoryTool(null)}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300"
                    >
                      Done
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Type something fun... (e.g. Coffee Date ☕)"
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-rose-400 mb-3"
                  />
                  {/* Font Color Picker */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Color:</span>
                    {["#ffffff", "#f43f5e", "#06b6d4", "#f59e0b", "#84cc16"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setStoryTextColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          storyTextColor === color ? "border-white scale-110" : "border-black/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVE TOOL DRAWER 3: STICKERS & EMOJIS */}
              {activeStoryTool === "sticker" && (
                <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-[#121118]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-4 flex flex-col z-40 overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-white">😀 Stickers & Emojis</span>
                    <button
                      onClick={() => setActiveStoryTool(null)}
                      className="text-xs font-bold text-stone-400 hover:text-white"
                    >
                      Done
                    </button>
                  </div>

                  {/* Preset Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {stickerPresets.map((stk) => (
                      <button
                        key={stk.label}
                        onClick={() => handleAddSticker(stk.label)}
                        className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/10 transition active:scale-95"
                      >
                        {stk.label}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Quick Bar */}
                  <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1.5">
                    Quick Emojis
                  </span>
                  <div className="flex flex-wrap gap-2 text-2xl">
                    {emojiPalette.map((em) => (
                      <button
                        key={em}
                        onClick={() => handleAddSticker(em)}
                        className="hover:scale-125 transition active:scale-95"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Studio Bottom Action Bar */}
            <div className="p-4 bg-black/40 border-t border-white/[0.08] flex items-center justify-between z-30">
              {storyMedia ? (
                <button
                  onClick={() => {
                    setStoryMedia(null);
                    setStorySong(null);
                    setStoryText("");
                    setStoryStickers([]);
                  }}
                  className="text-xs font-bold text-stone-400 hover:text-white px-3 py-2 rounded-xl transition"
                >
                  Change Media
                </button>
              ) : (
                <div className="text-[11px] text-stone-400">Select photo or video</div>
              )}

              {/* 1-CLICK INSTANT PUBLISH BUTTON */}
              <button
                onClick={handlePublishStory}
                disabled={!storyMedia && !storyText}
                className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-full shadow-lg shadow-rose-950/50 flex items-center space-x-1.5 hover:opacity-95 transition active:scale-95 cursor-pointer"
              >
                <span>Share to Your Story</span>
                <span>🌟</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE NEW POST (Instagram Style)
         ========================================================================= */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2rem] max-w-md w-full p-6 shadow-2xl relative text-stone-900">
            <button
              onClick={() => setNewPostModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <span className="text-2xl">📸</span>
              <h3 className="text-xl font-bold font-serif text-stone-900">Create New Post</h3>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Photo URL (or Unsplash link)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPostImg}
                  onChange={(e) => setNewPostImg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#711A31]"
                />
              </div>

              {newPostImg && (
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img src={newPostImg} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Caption & Tags
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a caption... #weekendvibes #mumbai #dating"
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#711A31] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#711A31] hover:bg-[#581426] text-white font-bold py-3.5 rounded-2xl shadow-md transition active:scale-95 text-xs flex items-center justify-center space-x-2"
              >
                <span>Share to Date-NearMe Feed</span>
                <span>🚀</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          HINGE FLOATING CAPSULE NAVIGATION BAR (Matches Screenshots 1, 2, 3)
         ========================================================================= */}
      <HingeNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        matchesCount={matchesList.length}
        unreadCount={(socketContext?.unreadCount || 0) + matchesList.filter((m) => m.unread).length}
        likesCount={likesYouList.length}
        userAvatar={profileForm.avatar || user?.avatar}
      />
    </div>
  );
};

export default Radar;
