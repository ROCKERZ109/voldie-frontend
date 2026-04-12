import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface BreathingLoaderProps {
  phase: string;
}

export default function BreathingLoader({ phase }: BreathingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 z-10">
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Render two expanding circles for a soft breathing effect */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-rose-200 to-orange-200 rounded-full blur-xl opacity-50"
            initial={{ width: 100, height: 100 }}
            animate={{ width: [100, 160, 100], height: [100, 160, 100] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
        <Heart size={40} className="text-rose-400 relative z-10" strokeWidth={1.5} />
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl font-medium text-gray-600 tracking-wide text-center"
      >
        {phase}
      </motion.p>
    </div>
  );
}
