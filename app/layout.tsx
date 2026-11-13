import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
// 1. استيراد مكون الخلفية
import BackgroundBlobs from "@/components/animations/BackgroundBlobs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Al Shimaa Marei — Motion Designer",
  description:
    "Motion Designer specializing in App UI Motion and 2D Animation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="relative">
        {/* 2. الخلفية المتحركة (هتكون ورا كل حاجة) */}
        <BackgroundBlobs />
        
        {/* 3. محتوى الموقع */}
        {children}
        
        {/* 4. طبقة النويز (هتكون فوق كل حاجة بس شفافة) */}
        <div className="bg-noise" />
      </body>
    </html>
  );
}