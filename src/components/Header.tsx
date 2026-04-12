"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  return (
    // 🚨 ADDED: dark:bg-slate-900/70 aur dark:border-slate-800/50
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-100/50 dark:border-slate-800/50 transition-colors duration-300">

      {/* Logo -> Redirects to Home */}
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-serif font-bold text-2xl tracking-tight text-slate-800 dark:text-slate-100 cursor-pointer"
        >
          For<span className="text-rose-500 dark:text-rose-400">  Voldie</span>
        </motion.div>
      </Link>

      {/* Navigation Links */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-8 text-sm font-medium"
      >
        <Link
          href="/tracker"
          className={`transition-colors hover:text-rose-500 dark:hover:text-rose-400 ${
            pathname === '/tracker'
              ? 'text-rose-500 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Tracker
        </Link>

        <Link
          href="/jobs"
          className={`transition-colors hover:text-rose-500 dark:hover:text-rose-400 ${
            pathname === '/jobs'
              ? 'text-rose-500 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Hunt
        </Link>
      </motion.nav>

    </header>
  );
}
