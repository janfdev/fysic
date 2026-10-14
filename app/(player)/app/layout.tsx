import React from "react";
import { Sidebar } from "@/components/sidebar";
import { PlayerBar } from "@/components/player-bar";
import Link from "next/link";
import { Home, Search, Disc3 } from "lucide-react";

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col overflow-hidden selection:bg-[#1ed760] selection:text-black">
      {/* Top Mobile Bar: Spotify Dark Header */}
      <div className="md:hidden h-14 border-b border-[#282828] bg-[#181818] px-4 flex items-center justify-between shrink-0">
        <Link href="/app" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1ed760] flex items-center justify-center text-black">
            <Disc3 className="w-4 h-4 fill-black stroke-black" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight">fysic</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="p-2 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#242424]"
            aria-label="Beranda"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Link
            href="/app/search"
            className="p-2 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#242424]"
            aria-label="Cari Lagu"
          >
            <Search className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Container: Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto pb-[98px]">
          {children}
        </main>
      </div>

      {/* Fixed Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
}
