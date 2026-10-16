"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../src/Context/AuthContext";
import SplashScreen from "../src/components/layout/SplashScreen";

export default function HomePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/radar");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-[#711A31] animate-spin" />
      </div>
    );
  }

  return <SplashScreen />;
}
