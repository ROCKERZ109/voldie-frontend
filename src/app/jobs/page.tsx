"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Trophy,
  Sparkle,
  Target,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  BookmarkSimple,
  Bookmark,
  MapPin,
  ArrowsClockwise,
  MagnifyingGlass, // 🚨 Added this icon for the search bar
} from "@phosphor-icons/react";
import canvasConfetti from "canvas-confetti";
import { Job, HuntResponse } from "@/types";

const LOADING_PHRASES = [
  "Scanning Gothenburg's tech scene...",
  "Filtering out the boring jobs...",
  "Analyzing the perfect vibe for you...",
  "Almost there, Koukla Mou...",
];

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "creative";

  const [huntData, setHuntData] = useState<HuntResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // 🚨 THE BACKDOOR STATES
  const [searchMode, setSearchMode] = useState<"magic" | "custom">("magic");
  const [customQuery, setCustomQuery] = useState("");

  const [savedJobs, setSavedJobs] = useState<Record<number, boolean>>({});
  const [feedbackState, setFeedbackState] = useState<
    Record<number, "like" | "dislike">
  >({});

  // THE SMART FETCH FUNCTION (Upgraded for Sniper Mode)
  const fetchJobs = async (forceRefresh = false) => {
    // Cache key badal jayega agar sniper mode on hai
    const cacheKey =
      searchMode === "custom" && customQuery
        ? `koritsi_jobs_custom_${customQuery.replace(/\s+/g, "_")}`
        : `koritsi_jobs_${mood}`;

    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setHuntData(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          query_type: "fullstack",
          // 🚨 THE MAGIC INJECTION
          custom_query: searchMode === "custom" ? customQuery : null,
        }),
      });

      if (!response.ok) throw new Error("API failed");

      const data: HuntResponse = await response.json();

      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      setHuntData(data);
    } catch (error) {
      console.error(error);
      const fallbackData = {
        market_analysis:
          "Gothenburg’s tech scene offers several entry-friendly backend and full‑stack openings, especially at innovative firms like Valtech and Sleep Cycle, making it a great time to apply.",
        jobs: [
          {
            title: "Backend Developer Automotive",
            company: "Valtech",
            apply_url:
              "https://se.linkedin.com/jobs/view/backend-developer-automotive-at-valtech-4289285331",
            match_reason:
              "A backend‑focused role in Gothenburg without senior‑level wording, suitable for a junior developer looking to grow in automotive software.",
          },
        ],
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      setHuntData(fallbackData);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    // Sirf magic mode mein automatic fetch hoga initial load pe.
    // Custom mode mein user ko button dabana padega.
    if (searchMode === "magic" || !huntData) {
      fetchJobs();
    }
  }, [mood]); // Removing searchMode dependency so it doesn't auto-fetch when just toggling

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleHired = () => {
    canvasConfetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#fb923c", "#fbbf24", "#10b981"],
    });
    localStorage.setItem("koritsi_hired_status", "true");
    setTimeout(() => router.push("/"), 3000);
  };

  const toggleSave = async (index: number) => {
    const job = huntData?.jobs?.[index];
    if (!job || !job.apply_url) return;

    setSavedJobs((prev) => ({ ...prev, [index]: true }));

    try {
      const jobDataToSave = {
        title: job.title,
        company: job.company,
        url: job.apply_url,
        vibe: job.match_reason,
        tech_stack: [],
        status: "Saved",
      };

      const saveResponse = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobDataToSave),
      });

      if (!saveResponse.ok) throw new Error("DB Save failed");
    } catch (error) {
      setSavedJobs((prev) => ({ ...prev, [index]: false }));
      alert("Oops! The universe had a hiccup saving this job.");
    }
  };

  const handleFeedback = async (index: number, type: "like" | "dislike") => {
    const job = huntData?.jobs?.[index];
    if (!job || !job.apply_url) return;

    const isCurrentlyActive = feedbackState[index] === type;
    const newType = isCurrentlyActive ? undefined : type;

    setFeedbackState((prev) => ({ ...prev, [index]: newType as any }));

    if (newType) {
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "anastasia",
            action: newType,
            job_url: job.apply_url,
            reason: job.match_reason,
          }),
        });
      } catch (error) {
        console.error("Feedback failed:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center z-10 min-h-[60vh]">
        <div className="relative flex items-center justify-center w-32 h-32 mb-8">
          <motion.div
            animate={{ scale: [1, 1.8, 2.5], opacity: [0.6, 0.1, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
            className="absolute w-16 h-16 bg-rose-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 2.5], opacity: [0.6, 0.1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: 1.25,
              ease: "easeOut",
            }}
            className="absolute w-16 h-16 bg-blue-400 rounded-full"
          />
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 rounded-full shadow-lg shadow-rose-500/10 border border-white dark:border-slate-700 z-10">
            <MapPin
              size={36}
              weight="duotone"
              className="text-rose-500 dark:text-rose-400"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkle size={16} weight="fill" className="text-amber-400" />
            </motion.div>
          </div>
        </div>
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingPhraseIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-xl font-serif italic text-gray-600 dark:text-slate-300 text-center tracking-wide"
            >
              {LOADING_PHRASES[loadingPhraseIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto pt-10 px-4 z-10 pb-20"
    >
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchJobs(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-full font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all active:scale-95"
            title="Search for new jobs"
          >
            <ArrowsClockwise size={18} weight="bold" /> Refresh Hunt
          </button>
          <button
            onClick={handleHired}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Trophy size={20} weight="fill" /> USE IT WHEN THE DAY ARRIVES!
          </button>
        </div>
      </div>

      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-800 dark:text-slate-100 mb-6 tracking-tight">
          Let's do some job hunt, should we?
        </h1>

        {/* 🚨 THE SLEEK SEARCH BAR CONTROLLER 🚨 */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/60 dark:bg-slate-900/60 p-2 rounded-full border border-gray-200 dark:border-slate-800 backdrop-blur-md w-full max-w-3xl shadow-sm">
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-full w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                setSearchMode("magic");
                fetchJobs(true);
              }} // Auto-fetch when returning to magic
              className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                searchMode === "magic"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-rose-500"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Sparkle
                size={16}
                weight={searchMode === "magic" ? "fill" : "bold"}
              />{" "}
              Auto-search
            </button>
            <button
              onClick={() => setSearchMode("custom")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                searchMode === "custom"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Target
                size={16}
                weight={searchMode === "custom" ? "fill" : "bold"}
              />{" "}
              Custom Search
            </button>
          </div>

          {/* Dynamic Input */}
          <div className="flex-1 w-full flex items-center gap-2 px-2">
            {searchMode === "magic" ? (
              <div className="flex-1 text-sm font-medium text-gray-400 dark:text-slate-500 italic px-2 py-2">
                Auto-scanning the matrix based on your vibe...
              </div>
            ) : (
              <input
                type="text"
                placeholder="e.g. 'Frontend developer Spotify Gothenburg'"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && customQuery.trim() && fetchJobs(true)
                }
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-800 dark:text-slate-200 px-2 py-2 outline-none"
              />
            )}

            {/* Launch Button for Sniper Mode */}
            <AnimatePresence>
              {searchMode === "custom" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => fetchJobs(true)}
                  disabled={!customQuery.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <MagnifyingGlass size={16} weight="bold" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {huntData?.jobs?.map((job, index) => {
          const isSaved = savedJobs[index];
          const feedback = feedbackState[index];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, ease: "easeOut" }}
              className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-3.5 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                  <Briefcase size={28} weight="thin" />
                </div>
                <button
                  onClick={() => toggleSave(index)}
                  className={`p-2 rounded-full transition-all duration-300 ${isSaved ? "bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400" : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"}`}
                  title={isSaved ? "Saved to Tracker" : "Save to Tracker"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isSaved ? "saved" : "unsaved"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isSaved ? (
                        <Bookmark size={22} weight="fill" />
                      ) : (
                        <BookmarkSimple size={22} weight="bold" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>

              <h2 className="text-2xl font-serif text-gray-800 dark:text-slate-100 mb-1 leading-tight">
                {job.title}
              </h2>
              <p className="text-sm uppercase tracking-widest font-semibold text-rose-500 dark:text-rose-400 mb-6">
                {job.company}
              </p>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed flex-grow mb-8 text-base">
                "{job.match_reason}"
              </p>

              <div className="pt-5 mt-auto border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(index, "like")}
                    className={`p-2.5 rounded-full transition-all ${feedback === "like" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
                  >
                    <ThumbsUp
                      size={20}
                      weight={feedback === "like" ? "fill" : "bold"}
                    />
                  </button>
                  <button
                    onClick={() => handleFeedback(index, "dislike")}
                    className={`p-2.5 rounded-full transition-all ${feedback === "dislike" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
                  >
                    <ThumbsDown
                      size={20}
                      weight={feedback === "dislike" ? "fill" : "bold"}
                    />
                  </button>
                </div>
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-white transition-all shadow-md active:scale-95"
                >
                  Explore <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>
            </motion.div>
          );
        })}

        {(!huntData?.jobs || huntData.jobs.length === 0) && (
          <div className="col-span-full py-10 text-center text-gray-500 font-serif italic">
            No specific jobs matched the vibe right now, but the universe is
            still working on it.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center mt-20 font-serif italic text-gray-500">
          Aligning the stars...
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
