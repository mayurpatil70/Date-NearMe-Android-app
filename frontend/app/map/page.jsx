import { Suspense } from "react";
import Radar from "../../src/components/Map/Radar";

export const metadata = {
  title: "Near Me Radar & Partner Cafes | Date-NearMe",
  description: "Interact with live nearby people using Date-NearMe and discover partner cafes for verified real-world dates.",
};

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-[#711A31] animate-spin" />
        </div>
      }
    >
      <Radar initialTab="map" />
    </Suspense>
  );
}

