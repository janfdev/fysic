import Link from "next/link";
import {
  Play,
  ArrowRight,
  ListOrdered,
  Volume2,
  Smartphone,
  Check,
  X,
  Disc3,
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const comparisonItems = [
    {
      feature: "Urutan Pemutaran (Sequential)",
      spotify: "Dipaksa acak (Forced Shuffle) di mobile",
      spotifyStatus: false,
      aura: "100% Berurutan (Track 1, 2, 3...) tanpa paksaan",
      auraStatus: true,
    },
    {
      feature: "Batas Lewati Lagu (Skip Limit)",
      spotify: "Maksimal 6 lewati per jam di akun gratis",
      spotifyStatus: false,
      aura: "Bebas lewati lagu tanpa batasan apapun",
      auraStatus: true,
    },
    {
      feature: "Interupsi Iklan Audio",
      spotify: "Iklan audio memotong daftar putar",
      spotifyStatus: false,
      aura: "Streaming bebas iklan audio langsung dari YouTube Music",
      auraStatus: true,
    },
    {
      feature: "Kontrol Layar Kunci (Media Session)",
      spotify: "Terkadang dibatasi fitur akun gratis",
      spotifyStatus: false,
      aura: "Dukungan penuh Media Session API di Android dan iOS",
      auraStatus: true,
    },
    {
      feature: "Penyusunan Antrean (Custom Queue)",
      spotify: "Terkunci dan tidak dapat diubah di mobile",
      spotifyStatus: false,
      aura: "Bebas atur dan susun ulang urutan playlist",
      auraStatus: true,
    },
  ];

  return (
    <div className="flex flex-col bg-[#121212] text-white">
      {/* Hero Section — Spotify Dark Cocoon */}
      <section className="relative overflow-hidden pt-24 pb-28 md:pt-32 md:pb-36 border-b border-[#282828] bg-gradient-to-b from-[#181818] to-[#121212]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#1ed760] text-xs font-bold uppercase tracking-wider mb-8">
            <ListOrdered className="w-4 h-4" />
            <span>Sequential Music Streaming</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Dengarkan playlist Anda. <br className="hidden sm:inline" />
            <span className="text-[#1ed760]">Sesuai urutan aslinya.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#b3b3b3] mb-10 leading-relaxed">
            Tidak ada forced shuffle. Tidak ada batas lewati lagu. Tidak ada interupsi iklan.
            fysic memanfaatkan katalog YouTube Music dengan audio engine mandiri yang menjamin pemutaran berurutan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] text-black uppercase tracking-wider text-xs transition-all shadow-[0_8px_24px_rgba(30,215,96,0.35)] hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-black stroke-black" />
              <span>Buka Web Player</span>
            </Link>

            <Link
              href="#perbandingan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white hover:text-white bg-[#1f1f1f] hover:bg-[#282828] border border-[#383838] uppercase tracking-wider text-xs transition-colors"
            >
              <span>Pelajari Perbandingan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="fitur" className="py-20 md:py-28 bg-[#121212] border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              Dirancang untuk Kontrol Penuh
            </h2>
            <p className="text-[#b3b3b3] text-base">
              Setiap komponen Fysic dibangun untuk mengembalikan kebebasan mendengarkan musik yang sebenarnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#383838] hover:bg-[#1e1e1e] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="w-12 h-12 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/20 flex items-center justify-center text-[#1ed760] mb-6">
                <ListOrdered className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Sequential Playback</h3>
              <p className="text-[#b3b3b3] text-sm leading-relaxed">
                Ketika satu lagu selesai, engine otomatis melanjutkan ke lagu bernomor urut berikutnya. Anda memegang kendali penuh kapan harus mengacak atau mengulang.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#383838] hover:bg-[#1e1e1e] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="w-12 h-12 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/20 flex items-center justify-center text-[#1ed760] mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Katalog YouTube Music</h3>
              <p className="text-[#b3b3b3] text-sm leading-relaxed">
                Cari jutaan lagu, remix, dan instrumen dari YouTube Music secara instan. Stream audio m4a dan opus berkualitas tinggi tanpa biaya langganan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#383838] hover:bg-[#1e1e1e] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="w-12 h-12 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/20 flex items-center justify-center text-[#1ed760] mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">PWA & Lockscreen Controls</h3>
              <p className="text-[#b3b3b3] text-sm leading-relaxed">
                Simpan aplikasi di layar utama ponsel Anda. Lagu tetap berputar saat layar mati dengan integrasi Media Session API untuk navigasi lewati dan jeda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section vs Spotify Free */}
      <section id="perbandingan" className="py-20 md:py-28 bg-[#181818] border-b border-[#282828]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              fysic vs Spotify Free
            </h2>
            <p className="text-[#b3b3b3] text-base">
              Perbandingan langsung fitur mendasar pemutar musik gratis di perangkat mobile.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#282828] bg-[#121212] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-12 bg-[#1f1f1f] p-4 sm:p-5 border-b border-[#282828] text-xs sm:text-sm font-bold uppercase tracking-wider">
              <div className="col-span-5 sm:col-span-4 text-[#b3b3b3]">Aspek Pemutar</div>
              <div className="col-span-3 sm:col-span-4 text-[#727272]">Spotify Free</div>
              <div className="col-span-4 sm:col-span-4 text-[#1ed760]">fysic</div>
            </div>

            <div className="divide-y divide-[#242424]">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center gap-2 hover:bg-[#1a1a1a] transition-colors">
                  <div className="col-span-5 sm:col-span-4 font-bold text-xs sm:text-sm text-white">
                    {item.feature}
                  </div>
                  <div className="col-span-3 sm:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-[#727272]">
                    <X className="w-4 h-4 text-[#f3727f] shrink-0 mt-0.5" />
                    <span>{item.spotify}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-white">
                    <Check className="w-4 h-4 text-[#1ed760] shrink-0 mt-0.5" />
                    <span className="font-bold text-[#1ed760]">{item.aura}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 md:py-28 bg-[#121212] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Kembalikan kendali playlist Anda hari ini
          </h2>
          <p className="text-[#b3b3b3] max-w-xl mx-auto mb-10 text-base">
            Buka web player langsung dari browser atau pasang di ponsel pintar Anda. Siap digunakan dalam hitungan detik tanpa perlu instalasi rumit.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] text-black uppercase tracking-wider text-xs transition-all shadow-[0_8px_24px_rgba(30,215,96,0.35)] hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-black stroke-black" />
            <span>Mulai Dengarkan Sekarang</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
