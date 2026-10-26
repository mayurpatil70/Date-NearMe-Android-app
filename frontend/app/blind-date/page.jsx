import { Suspense } from "react";
import Radar from "../../src/components/Map/Radar";

export const metadata = {
  title: "Blind Date & Discord Voice Lounge | Date-NearMe",
  description: "10-minute speed blind dates with mutual consent photo reveal, Discord-style voice stage rooms, and 15% partner cafe discounts.",
};

export default function BlindDatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-[#711A31] animate-spin" />
        </div>
      }
    >
      <Radar initialTab="blind-date" />
    </Suspense>
  );
}
