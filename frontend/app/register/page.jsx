import React, { Suspense } from "react";
import Register from "../../src/components/auth/Register";

export const metadata = {
  title: "Join Date-NearMe | Lifetime Membership",
  description: "Create an intentional dating account on Date-NearMe.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-[#711A31] rounded-full animate-spin" />
        </div>
      }
    >
      <Register />
    </Suspense>
  );
}
