import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropRules | Compare Prop Trading Firms",
  description: "Discover, compare, and evaluate proprietary trading firms with verified data, reviews, and exclusive deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} min-h-screen flex flex-col bg-[#050505] text-slate-50 antialiased selection:bg-blue-500/30`}>
        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
