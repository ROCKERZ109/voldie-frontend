import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "For Voldie",
  description: "Wassup Koukla Mou?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-500 bg-[#FFF9F5] dark:bg-[#0B0E14] text-gray-800 dark:text-slate-200 font-sans pt-20`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {/* Universal Background Elements (Persists across all pages without reloading) */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200/20 dark:bg-indigo-900/10 blur-[100px]" />
          </div>

          {/* The Persistent Theme Button */}
          <ThemeToggle />
          <Header />
          {/* Page Content Wrapper */}
          <main className="relative z-10 flex flex-col items-center min-h-screen pb-12">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}
