"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Fixed the import name to SmileyWink to match Phosphor's exact export
import { Quotes, SmileyWink, HandWaving } from "@phosphor-icons/react";
import { VibeData } from "@/types";

interface VibeCardProps {
  data: VibeData;
}

export default function VibeCard({ data }: VibeCardProps) {
  // State to manage the Upendra quote reveal
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // Added vertical margins (my-8 md:my-12) to push it to the center of the page
      className="w-full max-w-2xl mx-auto my-8 md:my-12 relative px-4 md:px-0 z-10"
    >
      {/* Decorative background glow for the mystic vibe */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-orange-200 dark:from-rose-900/30 dark:to-orange-900/30 rounded-3xl blur-xl opacity-40"></div>

      {/* The Card Container */}
      <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center min-h-[350px]">

        {/* Osho Section: NOW FULLY CENTERED */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-rose-400 mb-6">
            <Quotes size={24} weight="thin" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 dark:text-slate-400">
              The Universe Speaks
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-serif italic text-gray-800 dark:text-slate-100 leading-relaxed md:leading-snug max-w-xl">
            "{data.osho_quote}"
          </p>
        </div>

        {/* Separator Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent my-10"></div>

        {/* Upendra Section: The Interactive Reveal */}
        <div className="flex flex-col items-center justify-center min-h-[90px]">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              // The Suspense Button
              <motion.button
                key="reveal-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                onClick={() => setIsRevealed(true)}
                className="flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-300 rounded-full font-medium transition-all shadow-md hover:shadow-lg active:scale-95 border border-orange-100 dark:border-slate-600"
              >
                <HandWaving size={22} weight="thin" className="animate-bounce" />
                <span>Upendra wants to say something...</span>
              </motion.button>
            ) : (
              // The Cheesy Line with your bold SmileyWink
              <motion.div
                key="revealed-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full flex flex-col items-center"
              >
                <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 text-[10px] md:text-xs font-bold mb-5 uppercase tracking-widest shadow-inner">
                  <SmileyWink weight="bold" size={18} /> Hey, Koukla Mou!
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-slate-200 font-medium tracking-wide leading-relaxed max-w-lg">
                  {data.cheesy_line}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
