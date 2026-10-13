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
    <div className="h-screen bg-[#090a0f] text-[#f1f5f9] flex flex-col overflow-hidden">
      {/* Top Mobile Bar */}
      <div className="md:hidden h-14 border-b border-white/[0.08] bg-[#11131c] px-4 flex items-center justify-between shrink-0">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Disc3 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">Aura Music</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06]"
            aria-label="Beranda"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Link
            href="/app/search"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06]"
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

        <main className="flex-1 overflow-y-auto pb-[94px]">
          {children}
        </main>
      </div>

      {/* Fixed Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
}
