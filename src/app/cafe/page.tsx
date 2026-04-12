"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CafeWidget from "@/components/features/CafeWidget";

export default function CafePage() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center pt-10">
      {/* Nice little back button for UX */}
      <div className="w-full max-w-2xl flex justify-start mb-6 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to vibe
        </button>
      </div>

      <CafeWidget />
    </div>
  );
}
