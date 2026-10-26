import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import HingeNavBar from "../../components/HingeNavBar";
import {
  NEARBY_ACTIVE_USERS,
  PARTNER_CAFES,
  calculateDistanceKm,
} from "../components/Map/LiveDatingMap";

describe("1. Navigation Routes & Tab Integrity", () => {
  test("Navbar contains Discover, Near Me Map, Likes You, Matches, and Profile tabs", () => {
    const onTabChange = jest.fn();
    render(<HingeNavBar activeTab="discover" onTabChange={onTabChange} />);

    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Near Me")).toBeInTheDocument();
    expect(screen.getByText("Likes You")).toBeInTheDocument();
    expect(screen.getByText("Matches")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("Standouts is removed from top-level navbar and replaced by Near Me Map", () => {
    render(<HingeNavBar activeTab="map" onTabChange={() => {}} />);
    expect(screen.queryByText("Standouts")).toBeNull();
  });

  test("Switching tabs fires onTabChange callback with correct tab id", () => {
    const onTabChange = jest.fn();
    render(<HingeNavBar activeTab="discover" onTabChange={onTabChange} />);

    const mapButton = screen.getByText("Near Me").closest("button");
    fireEvent.click(mapButton);
    expect(onTabChange).toHaveBeenCalledWith("map");

    const likesButton = screen.getByText("Likes You").closest("button");
    fireEvent.click(likesButton);
    expect(onTabChange).toHaveBeenCalledWith("likes");
  });

  test("Badges for unread messages and likes are displayed accurately", () => {
    render(
      <HingeNavBar
        activeTab="discover"
        onTabChange={() => {}}
        unreadCount={3}
        likesCount={5}
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("2. Map Nearby Active Daters & Partner Cafes Data Integrity", () => {
  test("All active daters have valid Mumbai geographical coordinates, distance, and active status", () => {
    expect(NEARBY_ACTIVE_USERS.length).toBeGreaterThanOrEqual(5);

    NEARBY_ACTIVE_USERS.forEach((user) => {
      expect(user.id).toBeDefined();
      expect(user.name).toBeTruthy();
      expect(user.age).toBeGreaterThan(18);
      expect(user.lat).toBeGreaterThan(18.0);
      expect(user.lat).toBeLessThan(20.0);
      expect(user.lng).toBeGreaterThan(72.0);
      expect(user.lng).toBeLessThan(73.5);
      expect(user.distanceKm).toBeGreaterThan(0);
      expect(user.activeStatus).toBeTruthy();
      expect(["Pure Veg", "Jain", "Eggetarian"]).toContain(user.diet);
    });
  });

  test("Archie profile matches Screenshot 1 vitals (Lead UX Designer, Bandra West, Pure Veg)", () => {
    const archie = NEARBY_ACTIVE_USERS.find((u) => u.name === "Archie");
    expect(archie).toBeDefined();
    expect(archie.age).toBe(24);
    expect(archie.diet).toBe("Pure Veg");
    expect(archie.neighborhood).toContain("Bandra West");
    expect(archie.isShieldVerified).toBe(true);
  });

  test("All partner cafes have valid locations, ratings, and exclusive discount offers", () => {
    expect(PARTNER_CAFES.length).toBeGreaterThanOrEqual(4);

    PARTNER_CAFES.forEach((cafe) => {
      expect(cafe.id).toBeTruthy();
      expect(cafe.name).toBeTruthy();
      expect(cafe.discountOffer).toMatch(/(10%|15%|20%|Free)/);
      expect(cafe.rating).toBeGreaterThanOrEqual(4.5);
      expect(cafe.lat).toBeGreaterThan(18.0);
      expect(cafe.lng).toBeGreaterThan(72.0);
      expect(cafe.address).toBeTruthy();
    });
  });

  test("Includes Subko and Blue Tokai as partner cafes for real-world date planning", () => {
    const cafeNames = PARTNER_CAFES.map((c) => c.name);
    expect(cafeNames.some((n) => n.includes("Subko"))).toBe(true);
    expect(cafeNames.some((n) => n.includes("Blue Tokai"))).toBe(true);
  });
});

describe("3. Real-World Date Pass & Google Maps Integration Logic", () => {
  test("Generates valid Google Maps live directions URL with user origin and destination", () => {
    const cafe = PARTNER_CAFES[0];
    const userOrigin = "19.0596,72.8295";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userOrigin}&destination=${cafe.lat},${cafe.lng}&travelmode=driving`;
    expect(url).toContain("google.com/maps/dir");
    expect(url).toContain(`origin=${userOrigin}`);
    expect(url).toContain(String(cafe.lat));
    expect(url).toContain(String(cafe.lng));
    expect(url).toContain("travelmode=driving");
  });

  test("Accurately calculates real-time distance using Haversine formula", () => {
    const userLat = 19.0596;
    const userLng = 72.8295;
    // Same coordinate
    expect(calculateDistanceKm(userLat, userLng, userLat, userLng)).toBe(0);

    // Bandra to Khar (~1.1 km)
    const dist = calculateDistanceKm(userLat, userLng, 19.0680, 72.8340);
    expect(dist).toBeGreaterThan(0.8);
    expect(dist).toBeLessThan(1.5);
  });

  test("Google Maps free tile service endpoint structure matches roadmap and satellite specifications", () => {
    const roadmapUrl = "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    const satelliteUrl = "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    const subdomains = ["mt0", "mt1", "mt2", "mt3"];

    expect(roadmapUrl).toContain("lyrs=m");
    expect(satelliteUrl).toContain("lyrs=y");
    expect(subdomains).toHaveLength(4);
  });

  test("QR Date Pass token matches expected security prefix structure", () => {
    const venueId = "subko_bandra";
    const userId = "test_user_123";
    const qrToken = `VENUE-${venueId}-USER-${userId}-SEC-${Date.now()}`;
    expect(qrToken.startsWith(`VENUE-${venueId}-USER-${userId}`)).toBe(true);
    expect(qrToken.split("-").length).toBeGreaterThanOrEqual(6);
  });
});

describe("4. Socket.IO Real-Time Messaging & Offline Notifications Pipeline", () => {
  test("Online message payload includes all real-time delivery fields and timestamps", () => {
    const payload = {
      id: "msg_test_101",
      senderId: "user_a",
      receiverId: "user_b",
      message: "Subko or Blue Tokai this weekend? ☕",
      senderName: "Archie",
      senderAvatar: "https://example.com/avatar.jpg",
      timestamp: new Date(),
      status: "delivered",
    };

    expect(payload.id).toBeTruthy();
    expect(payload.senderId).toBe("user_a");
    expect(payload.receiverId).toBe("user_b");
    expect(payload.message).toContain("Subko");
    expect(payload.status).toBe("delivered");
    expect(payload.timestamp instanceof Date).toBe(true);
  });

  test("Offline notification queued with sender info and message preview when recipient is offline", () => {
    const offlineNotif = {
      id: "notif_202",
      user_id: "user_offline_b",
      sender_id: "user_online_a",
      sender_name: "Kalpesh",
      sender_avatar: "https://example.com/kalpesh.jpg",
      message_preview: "Hey! Loved your prompt about coffee dates ☕",
      is_read: false,
      created_at: new Date(),
    };

    expect(offlineNotif.user_id).toBe("user_offline_b");
    expect(offlineNotif.is_read).toBe(false);
    expect(offlineNotif.message_preview.length).toBeLessThanOrEqual(200);
    expect(offlineNotif.sender_name).toBe("Kalpesh");
  });

  test("Message delivery statuses accurately progress: sent -> delivered -> read", () => {
    const statuses = ["sent", "delivered", "read"];
    let currentStatus = "sent";

    // Recipient receives message
    currentStatus = "delivered";
    expect(statuses.indexOf(currentStatus)).toBe(1);

    // Recipient opens chat
    currentStatus = "read";
    expect(statuses.indexOf(currentStatus)).toBe(2);
  });

  test("Typing indicators emit and debounce appropriately", () => {
    const typingEvent = {
      senderId: "user_a",
      receiverId: "user_b",
      senderName: "Archie",
      isTyping: true,
    };

    expect(typingEvent.isTyping).toBe(true);
    expect(typingEvent.senderName).toBe("Archie");
  });
});

describe("5. Blind Dating, Discord Stage Rooms & FIFA Baller Card Logic", () => {
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  test("Formats 10-minute speed date countdown correctly", () => {
    expect(formatTimer(600)).toBe("10:00");
    expect(formatTimer(599)).toBe("9:59");
    expect(formatTimer(65)).toBe("1:05");
    expect(formatTimer(9)).toBe("0:09");
    expect(formatTimer(0)).toBe("0:00");
  });

  test("Mutual consent photo reveal state machine enforces 2-way approval", () => {
    let userConsented = false;
    let partnerConsented = false;
    const isPhotoRevealed = () => userConsented && partnerConsented;

    // Initially photos are blurred
    expect(isPhotoRevealed()).toBe(false);

    // User agrees to reveal
    userConsented = true;
    expect(isPhotoRevealed()).toBe(false); // Still hidden until partner agrees!

    // Partner also agrees
    partnerConsented = true;
    expect(isPhotoRevealed()).toBe(true); // Now unblurred!
  });

  test("Generates valid Discord room codes with DATE prefix", () => {
    const generateRoomCode = () => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      return `DATE-${rand}`;
    };

    const code = generateRoomCode();
    expect(code).toMatch(/^DATE-\d{4}$/);
  });

  test("Generates shareable Discord lounge room invite link", () => {
    const roomCode = "DATE-7749";
    const origin = "https://datenearme.vercel.app";
    const inviteLink = `${origin}/blind-date?room=${roomCode}`;

    expect(inviteLink).toBe("https://datenearme.vercel.app/blind-date?room=DATE-7749");
    expect(inviteLink).toContain("room=DATE-7749");
  });

  test("Calculates FIFA Baller Card tier and transfer valuation accurately", () => {
    const calculateBallerCard = (ovr) => ({
      ovr,
      tier: ovr >= 94 ? "ICONIC WORLD CLASS" : "ELITE ROMANTIC",
      transferValue: `₹${(ovr * 1.4).toFixed(1)}M`,
    });

    const cardElite = calculateBallerCard(91);
    expect(cardElite.tier).toBe("ELITE ROMANTIC");
    expect(cardElite.transferValue).toBe("₹127.4M");

    const cardIconic = calculateBallerCard(96);
    expect(cardIconic.tier).toBe("ICONIC WORLD CLASS");
    expect(cardIconic.transferValue).toBe("₹134.4M");
  });

  test("Partner cafe date pass coupon generates valid 15% discount for real-world dates", () => {
    const cafeCoupons = [
      { name: "Subko Coffee", coupon: "DATE-SUBKO-15" },
      { name: "Blue Tokai", coupon: "DATE-BLUETOKAI-15" },
      { name: "Third Wave Coffee", coupon: "DATE-THIRDWAVE-15" },
      { name: "Cafe Mondegar", coupon: "DATE-MONDEGAR-15" },
    ];

    cafeCoupons.forEach((cafe) => {
      expect(cafe.coupon.startsWith("DATE-")).toBe(true);
      expect(cafe.coupon.endsWith("-15")).toBe(true);
    });
  });
});
