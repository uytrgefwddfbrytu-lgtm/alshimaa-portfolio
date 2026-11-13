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
        mustard: "#FFB703", // 👈 اللون الأصفر الجديد المشبع
        teal: "#288B8B",
        charcoal: "#2D2926",
        deep: "#1A1A1A",
      },
      // ... باقي الإعدادات
    },
  },
  plugins: [],
};
export default config;