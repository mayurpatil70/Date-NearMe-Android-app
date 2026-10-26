import { Suspense } from "react";
import Radar from "../../src/components/Map/Radar";

export const metadata = {
  title: "Discover & Matches | Date-NearMe",
  description: "Explore verified matches, standouts, and live dating feeds on Date-NearMe.",
};

export default function RadarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-[#711A31] animate-spin" />
        </div>
      }
    >
      <Radar />
    </Suspense>
  );
}
