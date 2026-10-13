# Product Requirements Document (PRD)
## Proyek: Aura Music (Personal Music Player & Playlist Engine)

**Status:** Draft / Discovery Phase  
**Author:** janfdev & Hermes Agent  
**Tanggal:** 13 Oktober 2026  

---

## 1. Problem Statement (Latar Belakang & Masalah)
1. **Forced Shuffle di Spotify Free:** Spotify versi gratis pada perangkat mobile membatasi pengguna hanya dapat memutar daftar putar secara acak paksa (*shuffle only*), tanpa opsi memutar lagu berurutan.
2. **Keterbatasan Kontrol Pengguna:** Pengguna tidak dapat mengatur antrean putar (*queue*) secara bebas, batas lewati lagu (*skip limit*), dan interupsi iklan audio.
3. **Ketergantungan API Resmi:** Spotify Web Playback SDK resmi memblokir akun gratis (`403 Forbidden: Premium required`) sehingga pembuatan aplikasi pemutar kustom pihak ketiga tidak dapat menggunakan audio engine Spotify tanpa akun berbayar.

---

## 2. Solution Overview (Solusi)
Membangun aplikasi pemutar musik modern (Web/PWA) dengan arsitektur **YouTube Music Resolver & Independent Audio Engine**:
- **100% Sequential Playback:** Menggunakan engine HTML5 Audio mandiri yang menjamin lagu berputar berurutan (1, 2, 3...) sesuai daftar putar, dengan opsi un-shuffle, loop satu lagu, atau loop antrean.
- **Bebas Kelola Playlist:** Pengguna memiliki kendali penuh atas pembuatan playlist, penambahan lagu, drag-and-drop reordering, dan penamaan kategori.
- **Audio Stream Resolver:** Mengekstrak stream audio dari YouTube Music secara on-the-fly tanpa iklan dan tanpa kuota terbatas API Google resmi.
- **Desain Anti-Slop:** Antarmuka gelap elegan (Deep Obsidian & Emerald Accent) yang terinspirasi dari arsitektur desktop music player modern, tanpa elemen klise, kontras rasio WCAG AA, dan navigasi ramah keyboard.

---

## 3. User Stories

### A. Pengelolaan Playlist & Antrean (Core Flow)
1. Sebagai pengguna, saya ingin membuat playlist baru dengan nama dan deskripsi kustom agar lagu dapat dikelompokkan sesuai suasana hati.
2. Sebagai pengguna, saya ingin memutar playlist secara berurutan (*sequential*) dari lagu pertama hingga selesai tanpa dipaksa acak.
3. Sebagai pengguna, saya ingin mengatur ulang urutan lagu di playlist (*reorder queue*) agar lagu favorit dapat diputar lebih awal.
4. Sebagai pengguna, saya dapat mengaktifkan atau menonaktifkan mode acak (*shuffle toggle*) sesuai keinginan saya, bukan paksaan sistem.

### B. Pencarian & Penemuan Musik
1. Sebagai pengguna, saya ingin mencari lagu berdasarkan judul, nama artis, atau album dan langsung mendapatkan hasil YouTube Music yang relevan.
2. Sebagai pengguna, saya ingin menambahkan lagu dari hasil pencarian langsung ke antrean saat ini (*add to queue*) atau ke playlist tersimpan.

### C. Pengalaman Pemutaran (Playback Experience)
1. Sebagai pengguna, saya ingin memutar lagu dengan kontrol play/pause, seek timeline, volume bar, dan tombol previous/next yang responsif.
2. Sebagai pengguna, ketika satu lagu selesai diputar, aplikasi harus otomatis memicu pemutaran lagu berikutnya secara instan (*gapless transition*).

---

## 4. Technical Architecture Decisions

```
[ Frontend: Next.js / Vite React + Tailwind + shadcn/ui ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Local Cache / DB ]           [ Backend API Route ]
(IndexedDB / Drizzle DB)                 │
                                         ▼
                            [ YouTube Music Resolver ]
                             (youtubei.js / Piped API)
                                         │
                                         ▼
                            [ Direct Audio Stream URL ]
                                         │
                                         ▼
                             [ HTML5 Audio Element ]
```

1. **Frontend:** React / Next.js dengan arsitektur component shadcn/ui, memanfaatkan Web Audio API / HTML5 Audio dengan state manager antrean.
2. **Audio Resolver:**
   - Menggunakan library `youtubei.js` (Innertube) di backend Node.js untuk mengekstrak stream audio m4a/opus langsung dari YouTube Music tanpa butuh Google Cloud API key berbayar.
3. **Penyimpanan Playlist:**
   - Tahap awal: Local-first menggunakan IndexedDB / localStorage.
   - Tahap sinkronisasi: PostgreSQL (Neon) melalui Drizzle ORM.

---

## 5. Non-Functional Requirements & Anti-Slop Standards
- **Performance:** Waktu jeda transisi antar-lagu (resolving stream) < 1.5 detik.
- **Anti-Slop UI:**
  - Tanpa emoji di teks UI (menggunakan Lucide SVG semantik).
  - Skema warna berkarakter: Background `#090a0f`, surface `#11131c`, border `#ffffff14`, aksen Emerald `#10b981`.
  - Kontras teks minimal 4.5:1 (WCAG AA).
- **Aksesibilitas:** Kontrol player dapat dioperasikan via keyboard (Space untuk Play/Pause, Arrow Left/Right untuk Seek).
