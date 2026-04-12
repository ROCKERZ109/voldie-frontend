"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-20 right-6 p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-lg z-50 transition-all duration-300 hover:scale-110 active:scale-95 text-gray-800 dark:text-slate-200"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <Sun size={24} weight="thin" /> : <Moon size={24} weight="thin" />}
    </button>
  );
}
