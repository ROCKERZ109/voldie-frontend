"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, MapPin, PaperPlaneRight, CheckCircle } from "@phosphor-icons/react";

interface CafeData {
    name: string;
    address: string;
    why_go_there: string;
    }



export default function CafeWidget() {
  const [cafeData, setCafeData] = useState<CafeData | null>(null);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent">("idle");

  // Simulate fetching cafe from your API
 useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await fetch('/api/cafe');
        if (response.ok) {
          const data = await response.json();
          setCafeData(data.cafe);
        } else {
          throw new Error("Failed to load");
        }
      } catch (error) {
        // Fallback just in case backend is sleeping
        setCafeData({
          name: "Da Matteo, Magasinsgatan",
          address: "Cozy & Aesthetic",
          why_go_there: "Because you deserve the best Kanelbulle in Gothenburg.",
          });
      }
    };

    fetchCafe();
  }, []);
  const handleInvite = () => {
    setInviteStatus("sending");

    // Simulate sending an invite (In real app, trigger an email API or webhook here)
    setTimeout(() => {
      setInviteStatus("sent");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto z-10 mt-10"
    >
      {!cafeData ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="text-orange-300 dark:text-orange-500/50 mb-4"
          >
            <Coffee size={40} weight="thin" />
          </motion.div>
          <p className="text-gray-500 font-serif italic text-lg">Finding the perfect spot for you...</p>
        </div>
      ) : (
        // Cafe Card
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-10 rounded-[2rem] shadow-xl text-center">

          <div className="inline-flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full mb-6">
            <Coffee size={32} weight="thin" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-slate-100 mb-2">
            {cafeData.name}
          </h2>



          <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto">
            "{cafeData.why_go_there}"
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-slate-500 text-sm mb-10">
            <MapPin size={18} /> {cafeData.address}
          </div>

          {/* The Invite Action Area */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-8"></div>

          <AnimatePresence mode="wait">
            {inviteStatus === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <p className="text-gray-500 italic mb-4">Want company?</p>
                <button
                  onClick={handleInvite}
                  className="bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 px-8 py-4 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 group"
                >
                  Invite Upendra <PaperPlaneRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {inviteStatus === "sending" && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-orange-500 flex items-center justify-center gap-3 py-4"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Coffee size={24} />
                </motion.div>
                <span className="font-medium tracking-wide">Sending a raven to Upendra...</span>
              </motion.div>
            )}

            {inviteStatus === "sent" && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 py-4 px-6 rounded-2xl flex flex-col items-center gap-2"
              >
                <CheckCircle size={32} weight="fill" />
                <span className="font-medium">Invitation sent!</span>
                <span className="text-sm opacity-80">He'll be waiting for you.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
