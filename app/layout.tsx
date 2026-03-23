import type { Metadata } from "next";
import "./globals.css";
import { EventProvider } from "@/context/EventContext";
import ToastQueue from "@/components/popups/ToastQueue";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <EventProvider>
          {children}
          <ToastQueue />
        </EventProvider>
      </body>
    </html>
  );
}
