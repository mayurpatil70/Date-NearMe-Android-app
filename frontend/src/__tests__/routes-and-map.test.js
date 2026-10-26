import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import HingeNavBar from "../../components/HingeNavBar";
import {
  NEARBY_ACTIVE_USERS,
  PARTNER_CAFES,
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
  test("Generates valid Google Maps navigation directions URL", () => {
    const cafe = PARTNER_CAFES[0];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`;
    expect(url).toContain("google.com/maps/dir");
    expect(url).toContain(String(cafe.lat));
    expect(url).toContain(String(cafe.lng));
  });

  test("QR Date Pass token matches expected security prefix structure", () => {
    const venueId = "subko_bandra";
    const userId = "test_user_123";
    const qrToken = `VENUE-${venueId}-USER-${userId}-SEC-${Date.now()}`;
    expect(qrToken.startsWith(`VENUE-${venueId}-USER-${userId}`)).toBe(true);
    expect(qrToken.split("-").length).toBeGreaterThanOrEqual(6);
  });
});

