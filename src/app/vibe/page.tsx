"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import VibeCard from "@/components/cards/VibeCard";
import { VibeData } from "@/types";
import { Coffee, RocketLaunch } from "@phosphor-icons/react";
// Inner component that uses search parameters
function VibeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "creative"; // Default fallback

  const [vibeData, setVibeData] = useState<VibeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVibe = async () => {
      try {
        const response = await fetch("/api/vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood }),
        });
        const data = await response.json();
        setVibeData(data);
      } catch (error) {
        setVibeData({
          osho_quote: "Life is not a problem to be solved, but a mystery to be lived.",
          cheesy_line: "But honestly, you are the biggest mystery I want to solve today."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVibe();
  }, [mood]);

  if (isLoading) {
    return (
      <div className="py-32 text-center text-gray-500 flex flex-col items-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4 text-rose-400">
          <Heart size={32} />
        </motion.div>
        <p className="text-lg font-medium tracking-wide">Reading your energy...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl mx-auto flex flex-col items-center pt-10">
      {vibeData && <VibeCard data={vibeData} />}

   <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full">
  <button
    onClick={() => router.push("/cafe")}
    className="flex-1 flex items-center justify-center gap-3 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 py-4 rounded-2xl font-medium transition-colors border border-orange-200 dark:border-orange-800/50 group"
  >
    <Coffee size={24} weight="thin" className="group-hover:rotate-12 transition-transform" />
    Cheer me up
  </button>

  <button
    onClick={() => router.push(`/jobs?mood=${mood}`)} // Passing mood forward to job agent
    className="flex-1 flex items-center justify-center gap-3 bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white py-4 rounded-2xl font-medium transition-all shadow-lg shadow-gray-900/20 group hover:scale-[1.02] active:scale-95"
  >
    <RocketLaunch size={24} weight="thin" className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
    I'm pumped, let's hunt!
  </button>
</div>
    </motion.div>
  );
}

// Next.js requires Suspense boundary for useSearchParams
export default function VibePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading universe...</div>}>
      <VibeContent />
    </Suspense>
  );
}
