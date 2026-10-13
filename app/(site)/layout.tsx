import Link from "next/link";
import { Disc3, Play, Compass, ShieldCheck } from "lucide-react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f1f5f9] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Disc3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">fysic</span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                Sequential Engine
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#perbandingan"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:inline-block"
            >
              Perbandingan
            </Link>
            <Link
              href="#fitur"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:inline-block"
            >
              Fitur Utama
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/[0.2] transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/app"
              className="flex items-center gap-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Buka Player</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0c0e15] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Disc3 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm text-slate-400">
              fysic. Pemutar musik independen tanpa paksaan shuffle dan bebas interupsi iklan.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/app" className="hover:text-emerald-400 transition-colors">Web Player</Link>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Masuk</Link>
            <Link href="/register" className="hover:text-emerald-400 transition-colors">Daftar Akun</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
