import Link from "next/link";
import { Disc3, Play } from "lucide-react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col selection:bg-[#1ed760] selection:text-black">
      {/* Top Navbar: Spotify Dark Chrome */}
      <header className="sticky top-0 z-40 border-b border-[#282828] bg-[#121212]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black group-hover:scale-105 transition-transform shadow-[0_2px_8px_rgba(30,215,96,0.3)]">
              <Disc3 className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">fysic</span>
              <span className="hidden sm:inline-block text-[10px] text-[#1ed760] font-bold uppercase tracking-wider ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                Spotify Edition
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#perbandingan"
              className="text-xs font-bold text-[#b3b3b3] hover:text-white uppercase tracking-wider transition-colors hidden md:inline-block"
            >
              Perbandingan
            </Link>
            <Link
              href="#fitur"
              className="text-xs font-bold text-[#b3b3b3] hover:text-white uppercase tracking-wider transition-colors hidden md:inline-block"
            >
              Fitur
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-white hover:scale-105 px-5 py-2.5 rounded-full border border-[#7c7c7c] hover:border-white transition-all uppercase tracking-wider"
            >
              Masuk
            </Link>
            <Link
              href="/app"
              className="flex items-center gap-2 text-xs font-bold bg-[#1ed760] hover:bg-[#1fdf64] text-black px-5 py-2.5 rounded-full transition-all uppercase tracking-wider shadow-[0_4px_16px_rgba(30,215,96,0.3)] hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-black stroke-black" />
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
      <footer className="border-t border-[#282828] bg-[#181818] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#1ed760] flex items-center justify-center text-black">
              <Disc3 className="w-4 h-4 fill-black stroke-black" />
            </div>
            <p className="text-xs text-[#b3b3b3]">
              fysic. Pemutar musik independen berurutan tanpa forced shuffle dan bebas interupsi iklan.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
            <Link href="/app" className="hover:text-white transition-colors">Web Player</Link>
            <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
            <Link href="/register" className="hover:text-white transition-colors">Daftar Akun</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
