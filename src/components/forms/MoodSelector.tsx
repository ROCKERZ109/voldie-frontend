"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// Added PenNib for the custom typing option
import { Sparkle, Coffee, Lightning, Compass, ArrowRight, PenNib } from "@phosphor-icons/react";

interface MoodOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const MOODS: MoodOption[] = [
  { id: "Creative & Inspired", label: "Creative & Inspired", icon: Sparkle },
  { id: "A Little Burnt Out", label: "A Little Burnt Out", icon: Coffee },
  { id: "Super Pumped", label: "Super Pumped", icon: Lightning },
  { id: "I don't know", label: "I don't know", icon: Compass },
];

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  // State for the custom input
  const [customMood, setCustomMood] = useState("");

  const handleCustomSubmit = () => {
    if (customMood.trim()) {
      onSelect(customMood.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCustomSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto z-10 mt-8 px-4">
      <div className="flex flex-col">
        {/* Render predefined moods */}
        {MOODS.map((mood, index) => {
          const IconComponent = mood.icon;

          return (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, ease: "easeOut", duration: 0.8 }}
              onClick={() => onSelect(mood.id)}
              className="group relative flex items-center justify-between py-6 md:py-8 cursor-pointer border-b border-gray-200/50 dark:border-slate-800/50 last:border-0"
            >
              <motion.div
                whileHover={{ x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-6"
              >
                <IconComponent
                  size={42}
                  weight="thin"
                  className="text-gray-400 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 drop-shadow-sm flex-shrink-0"
                />

                <span className="text-3xl md:text-5xl font-serif text-gray-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors duration-500 tracking-tight">
                  {mood.label}
                </span>
              </motion.div>

              <div className="opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-rose-500 dark:text-rose-400 hidden sm:block">
                <ArrowRight size={36} weight="thin" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-rose-50/0 via-rose-50/50 to-rose-50/0 dark:from-rose-900/0 dark:via-rose-900/10 dark:to-rose-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />
            </motion.div>
          );
        })}

        {/* 🚨 THE CUSTOM "GHOST INPUT" ROW 🚨 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: MOODS.length * 0.15, ease: "easeOut", duration: 0.8 }}
          // Using focus-within so the whole row highlights when she clicks to type
          className="group relative flex items-center justify-between py-6 md:py-8 border-b border-gray-200/50 dark:border-slate-800/50 last:border-0 focus-within:border-rose-200 dark:focus-within:border-rose-900/50 transition-colors duration-500"
        >
          <div className="flex items-center gap-6 w-full group-focus-within:translate-x-5 transition-transform duration-500 ease-out">
            <PenNib
              size={42}
              weight="thin"
              className="text-gray-400 dark:text-slate-600 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 opacity-60 group-focus-within:opacity-100 transition-all duration-500 group-focus-within:scale-110 drop-shadow-sm flex-shrink-0"
            />

            {/* Seamless invisible input field */}
            <input
              type="text"
              placeholder="Or type your own vibe..."
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none font-serif text-3xl md:text-5xl placeholder:text-gray-300/50 dark:placeholder:text-slate-700/50 text-gray-600 dark:text-slate-300 focus:text-rose-500 dark:focus:text-rose-400 w-full transition-colors duration-500 tracking-tight"
            />
          </div>

          {/* Submit Arrow (Only appears magically when she actually types something) */}
          <button
            onClick={handleCustomSubmit}
            disabled={!customMood.trim()}
            className={`transition-all duration-500 flex-shrink-0 hidden sm:block ${
              customMood.trim()
                ? "opacity-100 translate-x-0 text-rose-500 cursor-pointer"
                : "opacity-0 -translate-x-8 pointer-events-none text-gray-300 dark:text-slate-700"
            }`}
          >
            <ArrowRight size={36} weight="thin" />
          </button>

          {/* Background glow when input is active */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50/0 via-rose-50/50 to-rose-50/0 dark:from-rose-900/0 dark:via-rose-900/10 dark:to-rose-900/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />
        </motion.div>

      </div>
    </div>
  );
}
