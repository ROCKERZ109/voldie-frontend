"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
/**
 * Import ThemeProviderProps directly from 'next-themes'.
 * The /dist/types path is deprecated in newer versions.
 */
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
