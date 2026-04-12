"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookmarkSimple, RocketLaunch, HourglassHigh,
  Handshake, Prohibit, Link, CircleNotch, Plus, Sparkle,
  ArrowUpRight,
  WarningCircle,
  TextAlignLeft,
  Checks
} from "@phosphor-icons/react";

type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Hired' | 'Rejected';

interface TrackedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  tech_stack: string[];
  vibe: string;
  status: JobStatus;
}

const COLUMNS: { id: JobStatus; label: string; icon: any; color: string; bg: string; activeBg: string }[] = [
  { id: 'Saved', label: 'Saved', icon: BookmarkSimple, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100/50 dark:bg-slate-800/30', activeBg: 'bg-slate-200 dark:bg-slate-700' },
  { id: 'Applied', label: 'Applied', icon: RocketLaunch, color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-900/10', activeBg: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'Interviewing', label: 'Interviewing', icon: HourglassHigh, color: 'text-purple-500', bg: 'bg-purple-50/50 dark:bg-purple-900/10', activeBg: 'bg-purple-100 dark:bg-purple-900/40' },
  { id: 'Hired', label: 'Hired', icon: Handshake, color: 'text-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-900/10', activeBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { id: 'Rejected', label: 'Rejected', icon: Prohibit, color: 'text-rose-500', bg: 'bg-rose-50/50 dark:bg-rose-900/10', activeBg: 'bg-rose-100 dark:bg-rose-900/40' },
];

export default function TrackerPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New State for Mobile Tabs
  const [activeMobileTab, setActiveMobileTab] = useState<JobStatus>('Saved');

  // Uploader States
  const [newUrl, setNewUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [rawText, setRawText] = useState("");
  const [extractError, setExtractError] = useState("");

  const handleManualExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'url' && !newUrl.trim()) return;
    if (inputMode === 'text' && !rawText.trim()) return;

    setIsExtracting(true);
    setExtractError("");

    try {
      const extractResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: inputMode === 'url' ? newUrl : "",
          raw_text: inputMode === 'text' ? rawText : ""
        })
      });

      if (!extractResponse.ok) throw new Error("Blocked by site");

      const extractResult = await extractResponse.json();

      const saveResponse = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractResult.data)
      });

      if (!saveResponse.ok) throw new Error("DB Save failed");
      const saveResult = await saveResponse.json();

      if (saveResult.data && saveResult.data.length > 0) {
        setJobs([saveResult.data[0], ...jobs]);
        setNewUrl("");
        setRawText("");
        setInputMode('url');
        setActiveMobileTab('Saved'); // Auto-switch to Saved tab on mobile
      }
    } catch (error) {
      console.error("Manual add failed:", error);
      if (inputMode === 'url') {
        setExtractError("Link blocked! Try pasting the job description in Text mode.");
        setInputMode('text');
      } else {
        setExtractError("Couldn't read this text. Try copying the core job details again.");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/tracker');
        if (!response.ok) throw new Error("Failed");
        const result = await response.json();
        if (result.success && result.data) {
          setJobs(result.data);
        }
      } catch (error) {
        console.error("Error fetching tracker data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const updateJobStatus = async (jobId: string, newStatus: JobStatus) => {
    const previousJobs = [...jobs];
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ));

    try {
      const response = await fetch(`/api/tracker/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error("Backend update failed");
    } catch (error) {
      setJobs(previousJobs);
      alert("Couldn't update the status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <CircleNotch size={32} />
        </motion.div>
        <span className="ml-3 font-serif text-xl italic">Loading your tracker...</span>
      </div>
    );
  }

  return (
    // Added a subtle radial gradient background for that premium feel
    <div className="w-full max-w-[1600px] mx-auto pt-10 px-4 min-h-screen pb-20 flex flex-col relative">

      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Area */}
      <div className="flex items-center justify-between mb-8 z-10">
        <button onClick={() => router.push('/jobs')} className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors font-medium">
          <ArrowLeft size={18} /> Back to Hunt
        </button>
      </div>

      <div className="mb-10 z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-slate-50 mb-3 tracking-tight">
            Track your jobs
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg max-w-md">
            Your personal job tracking universe. Drop a link or paste text to begin.
          </p>
        </div>

        {/* The Shape-Shifting Uploader (Polished) */}
        <div className="w-full xl:max-w-xl flex flex-col items-start xl:items-end">
          <div className="flex bg-white/60 dark:bg-slate-900/60 p-1 rounded-full border border-gray-200 dark:border-slate-800 mb-3 backdrop-blur-md">
            <button
              onClick={() => setInputMode('url')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${inputMode === 'url' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-200'}`}
            >
              <Link size={14} weight="bold" /> Link
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${inputMode === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-200'}`}
            >
              <TextAlignLeft size={14} weight="bold" /> Paste Text
            </button>
          </div>

          <form onSubmit={handleManualExtract} className="w-full relative flex flex-col gap-2 shadow-sm rounded-[1.5rem]">
            <AnimatePresence mode="wait">
              {inputMode === 'url' ? (
                <motion.div key="url-input" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="relative">
                  <div className="absolute left-5 top-4 text-gray-400 dark:text-slate-500 pointer-events-none">
                    <Link size={20} weight="bold" />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste public job link..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    disabled={isExtracting}
                    className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-700/80 rounded-full py-4 pl-14 pr-36 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-800 transition-all"
                  />
                </motion.div>
              ) : (
                <motion.div key="text-input" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="relative">
                  <textarea
                    placeholder="Paste the job description here (Ctrl+A, Ctrl+C)..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    disabled={isExtracting}
                    rows={4}
                    className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-700/80 rounded-[1.5rem] py-4 pl-5 pr-36 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-800 transition-all resize-none text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isExtracting || (inputMode === 'url' ? !newUrl : !rawText)}
              className={`absolute right-2 ${inputMode === 'url' ? 'top-2 bottom-2' : 'bottom-2 py-2'} bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-5 rounded-[1.2rem] font-bold transition-all flex items-center gap-2 disabled:opacity-50`}
            >
              {isExtracting ? (
                <><CircleNotch size={18} className="animate-spin" /> Digging</>
              ) : (
                <><Sparkle size={18} weight="fill" className={inputMode === 'url' ? "text-rose-400" : "text-rose-500"} /> Extract</>
              )}
            </button>
          </form>

          {extractError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-500 mt-3 text-sm font-medium self-start px-2 bg-rose-50 dark:bg-rose-900/20 py-1.5 px-3 rounded-lg border border-rose-100 dark:border-rose-900/50">
              <WarningCircle size={16} weight="bold" /> {extractError}
            </motion.div>
          )}
        </div>
      </div>

      {/* MOBILE TABS (Hidden on Desktop) */}
      <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar z-10 sticky top-[70px] bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-2">
        {COLUMNS.map(col => (
          <button
            key={col.id}
            onClick={() => setActiveMobileTab(col.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${
              activeMobileTab === col.id
                ? `${col.activeBg} ${col.color} border-transparent shadow-sm`
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400'
            }`}
          >
            <col.icon size={16} weight={activeMobileTab === col.id ? "fill" : "bold"} />
            {col.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeMobileTab === col.id ? 'bg-white/50 dark:bg-black/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
              {jobs.filter(j => j.status === col.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Kanban Board Container (Responsive) */}
      <div className="flex-grow flex flex-col md:flex-row gap-6 md:overflow-x-auto pb-8 z-10 hide-scrollbar items-start">
        {COLUMNS.map(column => {
          const columnJobs = jobs.filter(job => job.status === column.id);
          const Icon = column.icon;

          // Logic: Hide column on mobile if it's not the active tab. Always show on md+ screens.
          const isMobileHidden = activeMobileTab !== column.id ? "hidden md:flex" : "flex";

          return (
            <div
              key={column.id}
              className={`${isMobileHidden} w-full md:min-w-[340px] md:max-w-[360px] flex-shrink-0 flex-col rounded-[2rem] border border-white/60 dark:border-slate-800/60 p-5 backdrop-blur-xl ${column.bg} transition-all duration-300 shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${column.activeBg} ${column.color}`}>
                    <Icon size={20} weight="fill" />
                  </div>
                  <h2 className="font-serif text-xl font-medium text-gray-900 dark:text-slate-100">{column.label}</h2>
                </div>
                <div className="bg-white/60 dark:bg-slate-900/60 px-3 py-1 rounded-full text-sm font-bold text-gray-500 dark:text-slate-400 shadow-sm border border-gray-100 dark:border-slate-700/50">
                  {columnJobs.length}
                </div>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-4 flex-grow">
                <AnimatePresence>
                  {columnJobs.map(job => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100/50 dark:border-slate-700/50 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all group relative overflow-hidden"
                    >
                      {/* Top area: Title and Link */}
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-slate-50 leading-tight pr-4 text-lg">
                          {job.title}
                        </h3>
                        {job.url && (
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 p-2 rounded-full transition-colors flex-shrink-0">
                            <ArrowUpRight size={16} weight="bold" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs uppercase tracking-widest font-bold text-rose-500 dark:text-rose-400 mb-4">
                        {job.company}
                      </p>

                      {job.tech_stack && job.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tech_stack.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-100/80 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 text-[11px] rounded-lg border border-gray-200/50 dark:border-slate-700/50 font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-600 dark:text-slate-400 italic mb-6 line-clamp-2 leading-relaxed">
                        "{job.vibe}"
                      </p>

                      {/* THE NEW STATUS DOCK (Instead of big buttons) */}
                      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-slate-800/50">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">Change Status</span>
                        <div className="flex items-center justify-between bg-gray-50/80 dark:bg-slate-800/50 p-1.5 rounded-full border border-gray-100 dark:border-slate-700/50">
                          {COLUMNS.map(c => (
                            <button
                              key={c.id}
                              onClick={() => updateJobStatus(job.id, c.id)}
                              className={`p-2 rounded-full transition-all group/dockbtn ${
                                job.status === c.id
                                  ? `${c.activeBg} ${c.color} shadow-sm`
                                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'
                              }`}
                              title={`Move to ${c.label}`}
                            >
                              {job.status === c.id ? (
                                <Checks size={16} weight="bold" />
                              ) : (
                                <c.icon size={16} weight="fill" className="group-hover/dockbtn:scale-110 transition-transform" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {columnJobs.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-gray-200 dark:border-slate-700/50 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 opacity-60">
                    <Icon size={24} weight="duotone" className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No jobs yet</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
