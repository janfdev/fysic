# Specification: Aura Music (Personal Music Streaming Web & PWA)

## Problem Statement

Spotify Free pada perangkat mobile memberlakukan *forced shuffle* (pemutaran acak paksa), membatasi jumlah lewati lagu (*skip limit*), menyisipkan iklan audio, serta memblokir pemutaran playlist secara berurutan. Di sisi lain, API resmi Spotify Web Playback SDK mengunci kemampuan streaming lagu hanya untuk pengguna berbayar (`Spotify Premium`), sehingga pengembang tidak dapat membuat pemutar kustom pihak ketiga menggunakan API resmi Spotify tanpa memaksa pengguna berlangganan.

## Solution

Membangun aplikasi web dan Progressive Web App (PWA) modern berbasis Next.js 15 yang memisahkan antara antarmuka/katalog musik dan streaming audio:
1. **Audio Engine Mandiri:** Menggunakan YouTube Music scraper (`youtubei.js`) di backend Node.js untuk mengekstrak direct stream URL audio m4a/opus bebas iklan dan tanpa kuota terbatas API Google.
2. **Sequential Queue Control:** State machine pemutar audio lokal yang menjamin lagu berputar berurutan (1, 2, 3...) saat lagu sebelumnya selesai (`audio.onended`), dengan opsi shuffle/un-shuffle manual dan repeat.
3. **Multi-User Playlist Persistence:** Cloud database berbasis PostgreSQL (Neon) melalui Drizzle ORM untuk menyimpan playlist kustom, riwayat putar, dan urutan lagu yang tersinkronisasi lintas perangkat (desktop & smartphone).
4. **PWA & Media Session:** Integrasi `navigator.mediaSession` agar lagu dapat berputar di latar belakang saat layar smartphone mati (*lockscreen controls*).
5. **Split Architecture:** Landing page interaktif di `/` dan full-screen web player di `/app`.

---

## User Stories

1. Sebagai pengunjung, saya ingin melihat landing page di `/` yang menjelaskan fitur unggulan aplikasi, perbandingan vs Spotify Free, dan visual preview pemutar lagu, agar saya memahami nilai tambah aplikasi ini.
2. Sebagai pengguna baru, saya ingin mendaftar akun menggunakan email dan password di `/auth/register` agar memiliki ruang penyimpanan playlist pribadi.
3. Sebagai pengguna terdaftar, saya ingin masuk ke akun saya di `/auth/login` agar playlist saya tersinkronisasi di laptop dan smartphone.
4. Sebagai pengguna, saya ingin mencari lagu berdasarkan judul, nama artis, atau album di `/app/search` agar menemukan lagu yang ingin didengarkan dari katalog YouTube Music.
5. Sebagai pengguna, saya ingin memutar lagu langsung dari hasil pencarian agar dapat langsung mendengarkan audio berkualitas tinggi tanpa iklan.
6. Sebagai pengguna, saya ingin membuat playlist baru dengan judul dan deskripsi kustom di `/app/playlists` agar dapat mengelompokkan lagu sesuai tema.
7. Sebagai pengguna, saya ingin menambahkan lagu dari hasil pencarian ke dalam satu atau lebih playlist saya agar tersimpan secara permanen.
8. Sebagai pengguna, saya ingin memutar playlist secara berurutan dari lagu pertama hingga lagu terakhir tanpa dipaksa acak oleh sistem.
9. Sebagai pengguna, ketika satu lagu selesai diputar, saya ingin aplikasi otomatis memutar lagu berikutnya di playlist secara mulus (*gapless sequential*).
10. Sebagai pengguna, saya ingin mengatur ulang urutan lagu di playlist (pindah posisi ke atas/bawah) agar alur daftar putar sesuai keinginan saya.
11. Sebagai pengguna, saya ingin menghapus lagu dari playlist atau menghapus playlist yang sudah tidak dibutuhkan.
12. Sebagai pengguna, saya ingin melihat antrean lagu saat ini (*current queue drawer*) dan mengetahui lagu apa yang akan diputar berikutnya.
13. Sebagai pengguna, saya ingin mengontrol pemutaran melalui kontrol utama: Play/Pause, Next, Previous, Seek timeline slider, dan Volume bar.
14. Sebagai pengguna, saya ingin mengaktifkan mode Shuffle atau Repeat (Repeat One / Repeat All) secara manual tanpa paksaan.
15. Sebagai pengguna di smartphone, ketika layar ponsel terkunci atau membuka aplikasi lain, saya ingin lagu tetap berputar di latar belakang dengan kontrol Next/Prev dan cover art aktif di layar kunci (*lockscreen Media Session*).
16. Sebagai pengguna, saya ingin memasang aplikasi ini sebagai PWA (*Add to Home Screen*) di Android atau iOS agar dapat dibuka layaknya aplikasi native.

---

## Implementation Decisions

### 1. Modul dan Pembagian Rute
- `app/(site)/page.tsx`: Landing page publik interaktif (Hero, Perbandingan Fitur, Showcase UI, CTA).
- `app/(auth)/login/page.tsx` & `register/page.tsx`: Formulir autentikasi.
- `app/(player)/app/layout.tsx`: Layout khusus music player (Sidebar navigasi, top search bar, main content scroll area, fixed bottom player bar).
- `app/(player)/app/page.tsx`: Beranda pemutar musik (Rekomendasi playlist, lagu yang baru diputar).
- `app/(player)/app/search/page.tsx`: Pencarian katalog YouTube Music real-time.
- `app/(player)/app/playlist/[id]/page.tsx`: Detail playlist kustom, daftar lagu, tombol putar berurutan, dan pengurutan ulang.
- `app/api/search/route.ts`: Endpoint backend untuk query ke YouTube Music (`youtubei.js`).
- `app/api/stream/route.ts`: Endpoint backend untuk meresolusi stream URL audio m4a/opus dari YouTube video ID.
- `app/api/playlists/route.ts` & `[id]/route.ts`: Endpoint CRUD playlist dan manajemen relasi lagu.

### 2. Skema Database (Drizzle ORM + PostgreSQL)
- **`users`**: `id` (UUID/text), `email`, `password_hash`, `name`, `avatar_url`, `created_at`.
- **`playlists`**: `id` (UUID/text), `user_id` (FK users), `title`, `description`, `cover_url`, `created_at`, `updated_at`.
- **`playlist_tracks`**: `id` (serial), `playlist_id` (FK playlists), `youtube_id`, `title`, `artist`, `album`, `thumbnail_url`, `duration_seconds`, `sort_order` (integer), `created_at`.
- **`play_history`**: `id` (serial), `user_id` (FK users), `youtube_id`, `title`, `artist`, `thumbnail_url`, `played_at`.

### 3. State Management & Playback Engine
- **Audio Context / Global Player Store:** Menggunakan React Context + `useReducer` atau Zustand untuk mengelola:
  - `currentTrack`: Metadata lagu yang sedang aktif.
  - `queue`: Array lagu yang sedang dalam antrean.
  - `currentIndex`: Indeks lagu aktif di dalam antrean.
  - `playbackStatus`: `'playing' | 'paused' | 'buffering' | 'stopped'`.
  - `mode`: `isShuffle: boolean`, `repeatMode: 'off' | 'all' | 'one'`.
- **Event Listener Audio:**
  ```typescript
  audio.onended = () => {
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play();
    } else {
      playNext(); // Otomatis index = (currentIndex + 1) % queue.length
    }
  };
  ```
- **Media Session Integration:**
  ```typescript
  if ('mediaSession' in navigator && currentTrack) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album,
      artwork: [{ src: currentTrack.thumbnailUrl, sizes: '512x512', type: 'image/jpeg' }]
    });
    navigator.mediaSession.setActionHandler('play', () => resume());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
  }
  ```

---

## Testing Decisions

1. **Seam 1: Audio Resolver Integration (`/api/stream`)**
   - Menguji bahwa pemanggilan endpoint stream dengan `youtube_id` valid mengembalikan respons JSON berisi URL audio yang dapat di-stream dan berstatus 200.
2. **Seam 2: Playback Queue State Machine (Unit Test)**
   - Menguji logika deterministik: dari antrean berisi 3 lagu, transisi `ended` memindahkan pointer dari index 0 ke 1, lalu 1 ke 2, dan kembali ke 0 saat repeat aktif.
3. **Seam 3: Playlist CRUD & Relational Reorder (Integration Test)**
   - Menguji mutasi penambahan lagu dan perubahan urutan (`sort_order`) tetap konsisten di database.
4. **Seam 4: PWA & Media Session Contract**
   - Memverifikasi manifest PWA terkonfigurasi dan `navigator.mediaSession` ter-update tanpa melempar runtime error pada browser yang tidak mendukungnya.

---

## Out of Scope (Fase 1)

1. Dashboard Super Admin (ditunda ke fase 2).
2. Offline audio DRM download & local caching file audio terenkripsi di filesystem native.
3. Sinkronisasi status playback real-time ke profil Discord / Spotify Connect.
4. Lirik lagu tersinkronisasi karaoke real-time (*synced lyrics* - kandidat fase 2).

---

## Further Notes & Anti-Slop Visual Guidelines

- Tema warna antarmuka: **Deep Obsidian** (`#090a0f`), **Dark Slate Card** (`#161926`), dan aksen **Vibrant Emerald** (`#10b981`).
- Kontras teks: Memenuhi standar WCAG AA (minimal 4.5:1).
- Tanpa emoji pada seluruh label, tombol, dan notifikasi; menggunakan icon SVG Lucide yang konsisten.
- Kontrol keyboard: `Space` untuk toggle Play/Pause, `Arrow Right` untuk maju 5 detik, `Arrow Left` untuk mundur 5 detik.
