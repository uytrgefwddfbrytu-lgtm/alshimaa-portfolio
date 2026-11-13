import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F9F6F0",
        mustard: "#D49A2A",
        teal: "#288B8B",
        charcoal: "#2D2926",
        deep: "#1A1A1A",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "auto-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "auto-scroll": "auto-scroll 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;