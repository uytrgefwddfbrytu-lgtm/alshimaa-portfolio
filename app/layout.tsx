import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
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
        
        {/* الدوائر المتحركة في الخلف */}
        <BackgroundBlobs />
        
        {/* محتوى الموقع */}
        {children}
        
        
        
      </body>
    </html>
  );
}