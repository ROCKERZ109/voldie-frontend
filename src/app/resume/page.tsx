"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  FilePdf,
  UploadSimple,
  CircleNotch,
  CheckCircle,
  Briefcase,
  IdentificationBadge,
  Star,
  ArrowsClockwise,
  UserCircle,
  PaperPlaneRight,
  ReadCvLogoIcon,
} from "@phosphor-icons/react";
import canvasConfetti from "canvas-confetti";

export default function ResumePage() {
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // App States
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [parsedData, setParsedData] = useState<any>(null);

  // Dashboard State
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch Profile on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/resume/me");
        const result = await res.json();

        if (result.status === "success" && result.data) {
          setExistingProfile(result.data);
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      } catch (error) {
        setShowForm(true);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchProfile();
  }, []);

  const triggerConfetti = () => {
    canvasConfetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  const handleUrlSync = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) return;

    if (
      url.toLowerCase().includes(".pdf") ||
      url.includes("drive.google.com")
    ) {
      setStatus("error");
      alert(
        "Pro Tip: For PDF files, please download them and use the 'Upload PDF' tab instead of pasting the link! 📄",
      );
      return;
    }
    setIsSyncing(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/resume/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      setParsedData(data.data);
      setExistingProfile(data.data); // Update local state so it shows in dashboard later
      setStatus("success");
    //   triggerConfetti();
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsSyncing(true);
    setStatus("idle");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setParsedData(data.data);
      setExistingProfile(data.data);
      setStatus("success");
      triggerConfetti();
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleNotch size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto pt-16 px-4 min-h-screen pb-20 flex flex-col relative">
      {/* Subtle Background */}
      <div className="absolute top-0 left-[20%] w-96 h-96 bg-gray-200/20 dark:bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Clean Header */}
      <div className="z-10 mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl mb-4 shadow-sm border border-gray-200 dark:border-slate-700/50">
          <UserCircle
            size={32}
            weight="duotone"
            className="text-gray-700 dark:text-slate-300"
          />
        </div>
        <h1 className="text-4xl font-serif text-gray-900 dark:text-slate-50 mb-3 tracking-tight">
          Your Profile
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg">
          Sync your resume to automatically filter and find the jobs that match
          your exact skillset.
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto z-10">
        <AnimatePresence mode="wait">
          {/* THE DASHBOARD (Shows if profile exists) */}
          {!showForm && existingProfile && status !== "success" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                    Current Profile
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <CheckCircle
                      size={16}
                      weight="fill"
                      className="text-emerald-500"
                    />{" "}
                    Synced 
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <ArrowsClockwise size={16} weight="bold" /> Update CV
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-xs uppercase font-bold text-gray-400 mb-2">
                    <Briefcase size={14} /> Current Role
                  </span>
                  <p className="font-semibold text-gray-800 dark:text-slate-200">
                    {existingProfile.current_role || "Not specified"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-xs uppercase font-bold text-gray-400 mb-2">
                    <Star size={14} /> Experience
                  </span>
                  <p className="font-semibold text-gray-800 dark:text-slate-200">
                    {existingProfile.experience_years} Years
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                <span className="flex items-center gap-2 text-xs uppercase font-bold text-gray-400 mb-3">
                  <IdentificationBadge size={14} /> Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {existingProfile.parsed_skills?.map(
                    (skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm rounded-lg font-medium border border-gray-200 dark:border-slate-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* THE UPLOAD/LINK FORM */}
          {showForm && status !== "success" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm"
            >
              {existingProfile && (
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-slate-200 mb-6 flex items-center gap-2"
                >
                  ← Back to Profile
                </button>
              )}

              <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-xl mb-8 w-full max-w-sm mx-auto">
                <button
                  onClick={() => setInputMode("url")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 ${inputMode === "url" ? "bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Link size={16} weight="bold" /> Link CV
                </button>
                <button
                  onClick={() => setInputMode("upload")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 ${inputMode === "upload" ? "bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <FilePdf size={16} weight="bold" /> PDF File
                </button>
              </div>

              {inputMode === "url" ? (
                <form onSubmit={handleUrlSync} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Public URL
                    </label>
                    <input
                      type="url"
                      placeholder="e.g., https://yourwebsite.com/cv"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncing || !url}
                    className="mt-2 w-full bg-gray-900 hover:bg-gray-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <ReadCvLogoIcon size={28} className=" text-gray-400" />
                    {isSyncing ? (
                      <>
                        <CircleNotch size={20} className="animate-spin" />{" "}
                        Syncing...
                      </>
                    ) : (
                      "Sync Profile"
                    )}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleFileUpload}
                  className="flex flex-col gap-4"
                >
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadSimple
                      size={28}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="font-semibold text-gray-700 dark:text-slate-200 mb-1">
                      {file ? file.name : "Select a PDF file"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Click to browse or drag and drop
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSyncing || !file}
                    className="mt-2 w-full bg-gray-900 hover:bg-gray-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <ReadCvLogoIcon size={28} className=" text-gray-400" />
                    {isSyncing ? (
                      <>
                        <CircleNotch size={20} className="animate-spin" />{" "}
                        Uploading...
                      </>
                    ) : (
                      "Upload & Parse"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && parsedData && (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm text-center"
            >
              <div className="text-gray-900 dark:text-white mb-4 flex justify-center">
                <CheckCircle size={48} weight="fill" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2">
                Profile Synced
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mb-8">
                Your details have been securely saved to the database.
              </p>

              <button
                onClick={() => {
                  setStatus("idle");
                  setShowForm(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white py-3.5 rounded-xl font-bold transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 text-center text-sm font-medium">
              We couldn't process this. Please check the URL or try uploading a
              text-based PDF.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
