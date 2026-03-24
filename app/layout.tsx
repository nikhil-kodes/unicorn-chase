import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { EventProvider } from "@/context/EventContext";
import ToastQueue from "@/components/popups/ToastQueue";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Unicorn Chase — Live Startup Challenge",
  description: "Real-time scavenger hunt leaderboard by Udyami Cell, GL Bajaj.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <EventProvider>
          {children}
          <ToastQueue />
        </EventProvider>
        <Analytics />
      </body>
    </html>
  );
}
