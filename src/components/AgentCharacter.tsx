"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Interface defining optional props for the AgentCharacter.
 * Allows flexibility in placement and sound file naming.
 */
interface AgentCharacterProps {
  className?: string; // Optional custom Tailwind classes
  soundFile?: string; // Optional custom sound file name in /public
}

export default function AgentCharacter({
  className = "",
  soundFile = "hi.mp3",
}: AgentCharacterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio object on client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(`/${soundFile}`);

      // Cleanup listener on unmount to prevent potential state leaks
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }

    // Explicit cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundFile]);

  /**
   * Handles the click event. Plays the custom sound and triggers
   * the reaction animation state.
   */
  const playGreeting = () => {
    if (!audioRef.current || isPlaying) return;

    // Reset sound to start to allow rapid clicking
    audioRef.current.currentTime = 0;
    setIsPlaying(true);

    // Play sound (returns promise, explicitly handling here is best practice)
    audioRef.current.play().catch((error) => {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    });
  };

  return (
    <motion.div
      // Idle "Breathing/Floating" Animation - very smooth y-axis movement
      animate={{
        y: [0, -10, 0], // Floats up 10px and back
      }}
      transition={{
        duration: 4, // Very slow, gentle cycle
        repeat: Infinity, // Loops forever
        ease: "easeInOut",
      }}
      // Interactive scale effects
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={playGreeting}
      className={`relative cursor-pointer group ${className}`}
    >
      {/* Visual representation of the Agent (Stylized Orb/Figure) */}
      <div className="w-24 h-24 rounded-full bg-white/40 dark:bg-slate-800/60 backdrop-blur-md border border-white dark:border-slate-700 shadow-lg flex items-center justify-center p-4 transition-all group-hover:border-rose-300 dark:group-hover:border-rose-800">
        {/* Simple visual design (replace with SVG if desired) */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 dark:from-rose-900/50 dark:to-orange-900/50 flex items-center justify-center relative overflow-hidden">
          {/* Reaction Pulse when sound is playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 2 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white rounded-full"
              />
            )}
          </AnimatePresence>

          {/* Stylized 'Eyes' for personality */}
          <div className="flex gap-3 relative z-10">
            <div className="w-3 h-3 bg-gray-800 dark:bg-slate-100 rounded-full" />
            <div className="w-3 h-3 bg-gray-800 dark:bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Optional "Click Me" Tooltip on hover */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
        Play Greeting
      </span>
    </motion.div>
  );
}
