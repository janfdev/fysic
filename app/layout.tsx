import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/lib/player-context";

export const metadata: Metadata = {
  title: "Aura Music | Personal Music Streaming & Sequential Playback",
  description: "Web & PWA pemutar musik modern dengan sequential playback tanpa iklan, YouTube Music resolver, dan kontrol lockscreen.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#090a0f] text-[#f1f5f9] antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
