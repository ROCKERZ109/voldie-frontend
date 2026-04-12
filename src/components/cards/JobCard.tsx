import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Stagger animation timing based on the list position
      transition={{ delay: index * 0.15 }}
      // Light: White glassmorphism | Dark: Deep Slate glassmorphism
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white dark:border-slate-800 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col"
    >
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-serif font-medium text-gray-800 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
            {job.title}
          </h3>
          {/* Decorative star icon with soft orange glow */}
          <Star size={20} className="text-orange-300 dark:text-orange-400/80 fill-orange-50/50 dark:fill-orange-900/20 flex-shrink-0" />
        </div>

        {/* Brand/Company name in signature Rose color */}
        <p className="text-rose-500 dark:text-rose-400 font-medium mb-4 uppercase tracking-wider text-sm">
          {job.company}
        </p>

        {/* Detailed match reasoning text */}
        <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
          {job.match_reason}
        </p>
      </div>

      <a
        href={job.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-800 dark:text-slate-200 font-medium hover:text-rose-500 transition-colors mt-auto group/btn"
      >
        Take a look
        <ArrowRight
          size={16}
          className="group-hover/btn:translate-x-1 transition-transform"
        />
      </a>
    </motion.div>
  );
}
