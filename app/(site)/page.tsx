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
      aura: "Streaming bebas iklan audio langsung dari YouTube",
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-white/[0.06]">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Sequential Music Streaming</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Dengarkan playlist Anda. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Sesuai urutan aslinya.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
            Tidak ada forced shuffle. Tidak ada batas lewati lagu. Tidak ada interupsi iklan.
            fysic memanfaatkan katalog YouTube Music dengan audio engine mandiri yang menjamin pemutaran berurutan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Buka Web Player Sekarang</span>
            </Link>

            <Link
              href="#perbandingan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-slate-300 hover:text-white bg-[#11131c] hover:bg-[#161926] border border-white/[0.08] transition-colors"
            >
              <span>Pelajari Perbandingan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="fitur" className="py-20 md:py-28 bg-[#0b0d14] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Dirancang untuk Kontrol Penuh
            </h2>
            <p className="text-slate-400 text-base">
              Setiap komponen Aura Music dibangun untuk mengembalikan kebebasan mendengarkan musik yang sebenarnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#11131c] border border-white/[0.08] hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <ListOrdered className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Sequential Playback</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ketika satu lagu selesai, engine otomatis melanjutkan ke lagu bernomor urut berikutnya. Anda memegang kendali penuh kapan harus mengacak atau mengulang.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#11131c] border border-white/[0.08] hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Katalog YouTube Music</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cari jutaan lagu, remix, dan instrumen dari YouTube Music secara instan. Stream audio m4a dan opus berkualitas tinggi tanpa biaya langganan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#11131c] border border-white/[0.08] hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">PWA & Lockscreen Controls</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Simpan aplikasi di layar utama ponsel Anda. Lagu tetap berputar saat layar mati dengan integrasi Media Session API untuk navigasi lewati dan jeda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section vs Spotify Free */}
      <section id="perbandingan" className="py-20 md:py-28 bg-[#090a0f] border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              fysic vs Spotify Free
            </h2>
            <p className="text-slate-400 text-base">
              Perbandingan langsung fitur mendasar pemutar musik gratis di perangkat mobile.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11131c]">
            <div className="grid grid-cols-12 bg-[#161926] p-4 sm:p-5 border-b border-white/[0.08] text-xs sm:text-sm font-semibold">
              <div className="col-span-5 sm:col-span-4 text-slate-300">Aspek Pemutar</div>
              <div className="col-span-3 sm:col-span-4 text-slate-400">Spotify Free</div>
              <div className="col-span-4 sm:col-span-4 text-emerald-400">fysic</div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center gap-2 hover:bg-white/[0.02] transition-colors">
                  <div className="col-span-5 sm:col-span-4 font-medium text-xs sm:text-sm text-slate-200">
                    {item.feature}
                  </div>
                  <div className="col-span-3 sm:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-slate-400">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item.spotify}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-emerald-300">{item.aura}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-24 bg-[#0c0e15] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
            Kembalikan kendali playlist Anda hari ini
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-base">
            Buka web player langsung dari browser atau pasang di ponsel pintar Anda. Siap digunakan dalam hitungan detik tanpa perlu instalasi rumit.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Mulai Dengarkan Sekarang</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
