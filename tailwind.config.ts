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
        mustard: "#D49A2A", // 👈 رجعنا اللون زي ما كان
        teal: "#288B8B",
        charcoal: "#2D2926",
        deep: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
export default config;