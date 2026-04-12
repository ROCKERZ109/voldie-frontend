import type { Config } from "tailwindcss";

const config: Config = {
  // Use a string literal instead of an array to satisfy TypeScript's DarkModeStrategy type
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};

export default config;
