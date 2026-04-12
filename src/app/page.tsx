"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AgentCharacter from "@/components/AgentCharacter";
import MoodSelector from "@/components/forms/MoodSelector";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isBirthdayWindow, setIsBirthdayWindow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const month = today.getMonth(); // 3 = April
    const date = today.getDate();

    if (month === 3 && (date === 13 || date === 14)) {
      setIsBirthdayWindow(true);
    }
  }, []);

  const handleMoodSelection = (selectedMood: string) => {
    // Navigate to the Vibe page and pass the mood in the URL
    router.push(`/vibe?mood=${selectedMood}`);
  };

  if (!mounted) return null;

  return (
    // Adjusted container to center perfectly below the fixed global header
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">

      {/* --- MAIN CONTENT --- */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 z-10 flex flex-col items-center px-4"
        >
          <div className="mb-6">
            <AgentCharacter />
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 tracking-tight transition-all">
            {isBirthdayWindow ? (
              <>Happy Birthday, <span className="text-rose-500 italic">Koritsi</span></>
            ) : (
              <>Wassup, <span className="text-rose-500 italic">Koukla Mou?</span></>
            )}
          </h1>

          <p className="text-gray-500 dark:text-slate-400 text-xl max-w-md mx-auto font-medium">
            How are you feeling today?
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="z-10">
        <MoodSelector onSelect={handleMoodSelection} />
      </div>
    </div>
  );
}
