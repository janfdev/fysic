import Link from "next/link";
import {
  Play,
  ArrowRight,
  ListOrdered,
  Smartphone,
  Check,
  X,
  Search,
  Radio,
  Headphones
} from "lucide-react";

export default function LandingPage() {
  const comparisonItems = [
    {
      feature: "Urutan Pemutaran Asli",
      spotify: "Dipaksa acak (Forced Shuffle) di aplikasi seluler",
      aura: "100% Berurutan (Track 1, 2, 3...) sesuai kurasi album",
    },
    {
      feature: "Batas Lewati Lagu",
      spotify: "Maksimal 6 kali lewati per jam di akun gratis",
      aura: "Bebas lewati lagu tanpa batasan apapun",
    },
    {
      feature: "Interupsi Iklan Audio",
      spotify: "Iklan audio memotong daftar putar",
      aura: "Bebas iklan audio langsung dari YouTube Music resolver",
    },
    {
      feature: "Kontrol Layar Kunci",
      spotify: "Terkadang dibatasi pada akun non-premium",
      aura: "Dukungan penuh Media Session API di Android dan iOS",
    },
    {
      feature: "Penyusunan Antrean Lagu",
      spotify: "Terkunci dan tidak dapat diubah di perangkat mobile",
      aura: "Bebas atur dan susun ulang posisi urutan lagu",
    },
  ];

  return (
    <div className="flex flex-col bg-[#121212] text-white selection:bg-[#1ed760] selection:text-black">
      {/* ── 1. HERO SECTION (Strict Taste v2 Hero Discipline) ──────────────── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-[#242424] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: 2-line Headline & Primary CTA */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-[#282828] text-[#1ed760] text-xs font-bold uppercase tracking-wider">
                <Headphones className="w-3.5 h-3.5" />
                <span>Sequential Engine Ready</span>
              </div>

              {/* Strict Rule: Max 2 lines on desktop */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                Dengarkan album Anda sesuai urutan aslinya.
              </h1>

              {/* Strict Rule: Under 20 words */}
              <p className="text-base sm:text-lg text-[#b3b3b3] leading-relaxed max-w-xl">
                Bebas forced shuffle, bebas batasan skip, dan tanpa interupsi iklan audio komersial.
              </p>

              {/* Above the fold CTA with Full Pill Geometry */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] text-black uppercase tracking-wider text-xs transition-all shadow-[0_8px_24px_rgba(30,215,96,0.35)] hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-black stroke-black" />
                  <span>Buka Web Player</span>
                </Link>

                <Link
                  href="#perbandingan"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-white bg-[#1f1f1f] hover:bg-[#282828] border border-[#383838] uppercase tracking-wider text-xs transition-colors"
                >
                  <span>Lihat Perbandingan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual Material (Player Device Frame) */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl bg-[#181818] border border-[#282828] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
                <div className="aspect-square rounded-xl overflow-hidden bg-[#242424] mb-4 relative group shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1618609377864-68609b857e90?w=600"
                    alt="Album Artwork Hero"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#1ed760] uppercase tracking-wider">Sedang Memutar</span>
                      <p className="font-extrabold text-white text-base truncate">Midnight Instrumental Odyssey</p>
                      <p className="text-xs text-[#b3b3b3]">Lofi & Ambient Soundscapes</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Tactile Player Controls */}
                <div className="space-y-3">
                  <div className="w-full h-1.5 bg-[#333333] rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-[#1ed760] rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#727272]">
                    <span>02:45</span>
                    <span>04:12</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. ASYMMETRIC VALUE SECTIONS (No 3-Equal Cards Slop) ─────────── */}
      <section id="fitur" className="py-24 border-b border-[#242424]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
          
          {/* Row 1: Left Heavy (Sequential Engine) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 bg-[#181818] border border-[#282828] rounded-2xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              <div className="size-12 rounded-full bg-[#1ed760]/10 flex items-center justify-center text-[#1ed760] mb-6">
                <ListOrdered className="size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                Alur Pemutaran Berurutan 100%
              </h2>
              <p className="text-sm sm:text-base text-[#b3b3b3] leading-relaxed">
                Di layanan gratisan konvensional, daftar lagu Anda diacak secara paksa. Fysic memastikan lagu pertama dilanjutkan ke lagu kedua hingga selesai persis seperti visi sang musisi saat memproduksi album.
              </p>
            </div>
            <div className="md:col-span-5 bg-[#181818]/60 border border-[#242424] rounded-2xl p-6 text-xs font-mono space-y-3">
              <span className="text-[#1ed760] uppercase tracking-wider font-bold">Playback Order Log</span>
              <div className="p-3 rounded-lg bg-[#121212] border border-[#242424] flex items-center justify-between">
                <span>01. Prelude of Dawn</span>
                <span className="text-[#1ed760]">Selesai</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1ed760]/10 border border-[#1ed760]/30 text-white flex items-center justify-between">
                <span className="font-bold">02. Neon Horizon (Active)</span>
                <span className="text-[#1ed760] font-bold">Memutar</span>
              </div>
              <div className="p-3 rounded-lg bg-[#121212] border border-[#242424] flex items-center justify-between text-[#727272]">
                <span>03. Midnight Transit</span>
                <span>Antrean</span>
              </div>
            </div>
          </div>

          {/* Row 2: Right Heavy (YouTube Music Catalog + Lockscreen) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 bg-[#181818]/60 border border-[#242424] rounded-2xl p-6 text-xs space-y-4 order-2 md:order-1">
              <div className="p-4 rounded-xl bg-[#121212] border border-[#242424] flex items-center gap-3">
                <Smartphone className="size-8 text-[#1ed760] shrink-0" />
                <div>
                  <p className="font-bold text-white">Media Session Lockscreen</p>
                  <p className="text-[11px] text-[#b3b3b3]">Lagu tetap berputar saat layar HP mati tanpa putus.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#121212] border border-[#242424] flex items-center gap-3">
                <Radio className="size-8 text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Direct Stream Resolver</p>
                  <p className="text-[11px] text-[#b3b3b3]">Ekstraksi direct audio m4a/opus resmi tanpa buffer delay.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-[#181818] border border-[#282828] rounded-2xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] order-1 md:order-2">
              <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Search className="size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                Katalog Lengkap YouTube Music
              </h2>
              <p className="text-sm sm:text-base text-[#b3b3b3] leading-relaxed">
                Jelajahi jutaan karya musik, mulai dari rekaman resmi label besar, cover akustik independen, hingga rekaman konser live dengan kualitas audio stabil tanpa biaya langganan bulanan.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. COMPARISON SECTION (Clean & High Contrast) ─────────────────── */}
      <section id="perbandingan" className="py-24 border-b border-[#242424]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Perbandingan dengan Layanan Gratis Biasa
            </h2>
            <p className="text-[#b3b3b3] text-sm">
              Perbedaan nyata dalam kebebasan mendengarkan musik di perangkat mobile.
            </p>
          </div>

          <div className="rounded-2xl border border-[#282828] bg-[#181818] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-12 bg-[#1f1f1f] p-4 sm:p-5 border-b border-[#282828] text-xs font-bold uppercase tracking-wider">
              <div className="col-span-5 text-[#b3b3b3]">Fitur Inti</div>
              <div className="col-span-3 text-[#727272]">Aplikasi Gratis Biasa</div>
              <div className="col-span-4 text-[#1ed760]">Fysic Player</div>
            </div>

            <div className="divide-y divide-[#242424]">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center gap-2 hover:bg-[#202020] transition-colors">
                  <div className="col-span-5 font-bold text-xs sm:text-sm text-white">
                    {item.feature}
                  </div>
                  <div className="col-span-3 flex items-start gap-2 text-xs text-[#727272]">
                    <X className="size-4 text-[#f3727f] shrink-0 mt-0.5" />
                    <span>{item.spotify}</span>
                  </div>
                  <div className="col-span-4 flex items-start gap-2 text-xs sm:text-sm text-white">
                    <Check className="size-4 text-[#1ed760] shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">{item.aura}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FINAL CALL TO ACTION ───────────────────────────────────────── */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Mulai dengarkan musik dengan kendali penuh
          </h2>
          <p className="text-[#b3b3b3] text-sm sm:text-base max-w-lg mx-auto">
            Buka langsung web player dari peramban Anda tanpa perlu instalasi aplikasi berat.
          </p>
          <div className="pt-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] text-black uppercase tracking-wider text-xs transition-all shadow-[0_8px_24px_rgba(30,215,96,0.35)] hover:scale-105 active:scale-95"
            >
              <Play className="size-4 fill-black stroke-black" />
              <span>Buka Fysic Player</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
