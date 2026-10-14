# [Fysic] Spotify-Grade Design System Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyelaraskan seluruh antarmuka aplikasi Fysic (Landing Page, Player Shell, Sidebar, Now-Playing Bar, Search, Playlist Page) dengan desain Spotify DESIGN.md yang otentik: palet #121212 / #181818 / #1f1f1f, aksen Spotify Green #1ed760, tombol pill & circle, tipografi uppercase ber-tracking luas, serta komponen terstruktur.

**Architecture:**
1. Update `app/globals.css` dengan token desain Spotify `#121212`, `#181818`, `#1f1f1f`, dan `#1ed760`.
2. Refactor komponen inti:
   - `components/player-bar.tsx`: Circular play button Spotify Green (#1ed760) dengan ikon hitam, scrubber track Spotify-style, dan volume pill.
   - `components/sidebar.tsx`: Dark sidebar Spotify-grade dengan nav links pill, typography weight contrast 700/400, dan create playlist pill button.
   - `components/queue-drawer.tsx` & `components/add-to-playlist-modal.tsx`: Modal dan drawer bergaya Spotify dengan heavy shadows (`rgba(0,0,0,0.5)`).
3. Refactor halaman:
   - `app/(site)/page.tsx`: Landing page bertema media theater Spotify.
   - `app/(player)/app/page.tsx`: Grid album card dengan hover play button circle Spotify.
   - `app/(player)/app/search/page.tsx`: Search input pill 500px dengan genre chips pill.
   - `app/(player)/app/playlist/[id]/page.tsx`: Hero playlist banner dengan header gradient ke dark.

**Tech Stack:** Next.js 15, Tailwind CSS v4, Lucide Icons, SQLite Drizzle ORM, HTML5 Audio Engine.

**Spec:** `/root/music-player-prototype/DESIGN.md`

## Global Constraints

- No em-dash (`—`) dalam teks UI atau copy baru (Anti-slop R-02).
- Spotify Green (`#1ed760`) hanya untuk fungsi interaktif (Play, Active highlight, Primary CTA), tidak dijadikan background menyeluruh.
- Tombol wajib berbentuk Pill (`rounded-full` / 9999px) atau Circle (`rounded-full` 50%).
- Strict TypeScript: `npm run build` wajib exit 0 tanpa error.

---

### Task 1: Color Tokens & Global Spotify CSS (`app/globals.css`)
- [ ] **Step 1:** Definisikan CSS variables Spotify `#121212`, `#181818`, `#1f1f1f`, `#1ed760`, `#b3b3b3` di `app/globals.css`.
- [ ] **Step 2:** Konfigurasikan styling focus ring keyboard hijau Spotify `#1ed760`.
- [ ] **Step 3:** Verifikasi kompilasi CSS Tailwind v4.

---

### Task 2: Spotify Now-Playing Bottom Bar Refactor (`components/player-bar.tsx`)
- [ ] **Step 1:** Ubah Play/Pause button menjadi lingkaran penuh 50% warna Spotify Green `#1ed760` dengan icon warna hitam `#000000`.
- [ ] **Step 2:** Terapkan scrubber progress bar tipis yang berubah hijau saat di-hover/aktif.
- [ ] **Step 3:** Format judul lagu putih bold (#ffffff) dan nama artis perak (#b3b3b3).

---

### Task 3: Spotify Navigation Sidebar & Pill Controls (`components/sidebar.tsx`)
- [ ] **Step 1:** Terapkan warna latar `#121212` / `#181818` dengan border halus `#282828`.
- [ ] **Step 2:** Perbarui nav link dengan tipografi weight 700 (aktif/putih) dan 400 (inaktif/perak #b3b3b3).
- [ ] **Step 3:** Ubah tombol Create Playlist menjadi pill button yang ramping.

---

### Task 4: Content Pages Redesign (`app/(player)/app/*`)
- [ ] **Step 1:** `app/(player)/app/page.tsx`: Terapkan album card Spotify dengan floating circular play button saat hover.
- [ ] **Step 2:** `app/(player)/app/search/page.tsx`: Ganti search bar menjadi pill 500px dengan padding icon-aware.
- [ ] **Step 3:** `app/(player)/app/playlist/[id]/page.tsx`: Buat header playlist heroik dengan tracklist table bergaya Spotify.

---

### Task 5: Modals, Drawers & Landing Page Harmonization
- [ ] **Step 1:** `components/queue-drawer.tsx` & `components/add-to-playlist-modal.tsx`: Terapkan heavy shadow dan modal card `#242424`.
- [ ] **Step 2:** `app/(site)/page.tsx`: Rapikan hero CTA landing page menggunakan pill uppercase Spotify-style.
- [ ] **Step 3:** Jalankan `npm run build` untuk memverifikasi 100% build hijau.
- [ ] **Step 4:** Commit semua perubahan ke git.
