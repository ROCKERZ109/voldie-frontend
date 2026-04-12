import React from "react";
import { motion } from "framer-motion";
import { Coffee, ArrowRight } from "lucide-react";

/**
 * Interface defining the expected props for the TargetForm component.
 * Ensures strict typing for state management and submission handlers.
 */
interface TargetFormProps {
  mood: string;
  setMood: (value: string) => void;
  onSubmit: () => void;
}

export default function TargetForm({ mood, setMood, onSubmit }: TargetFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg z-10"
    >
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-slate-800">

        {/* Input Label with context-aware text color */}
        <label className="text-gray-600 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
          <Coffee size={18} className="text-orange-400" />
          My current mood is...
        </label>

        {/* Self-contained textarea with focus states and dark mode variations */}
        <textarea
          className="w-full bg-white/80 dark:bg-slate-950/80 border-none rounded-2xl p-5 text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/50 resize-none shadow-inner transition-all placeholder-gray-300 dark:placeholder-slate-600 text-lg"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="E.g., I'm feeling creative, a bit tired of corporate stuff, but ready to build something beautiful..."
          rows={4}
        />

        {/* Primary Action Button: Handles conditional disabling and aesthetic transitions */}
        <button
          onClick={onSubmit}
          disabled={!mood.trim()}
          className="w-full mt-6 bg-gray-900 dark:bg-slate-100 dark:text-gray-900 disabled:bg-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:shadow-none hover:bg-gray-800 dark:hover:bg-white text-white font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98]"
        >
          Discover Matches
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
