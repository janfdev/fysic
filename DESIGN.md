# Fysic DESIGN.md — Spotify-Inspired Media Design System

> **Aesthetic Language:** Dark, immersive, content-first audio experience.
> **Philosophy:** "Content-first darkness" — The UI recedes into shadow (#121212, #181818, #1f1f1f) so that album art, music tracks, and playback waveforms glow. Spotify Green (#1ed760) acts as a singular functional accent, never decorative.
> **Dials:** ENERGY 1 (Calm Dark Theatre) / RHYTHM 2 (Structured Density) / MOTION 1 (Precise Tactile Feedback)

---

## 1. Visual Theme & Atmosphere

Fysic embodies a tactile, precision-engineered music player device. The entire interface lives in an achromatic cocoon where album art is the sole source of dynamic color.

### Core Principles
- **Achromatic Receding UI:** The background (#121212) and surfaces (#181818, #1f1f1f) are deep charcoals. UI chrome does not compete with cover art.
- **Spotify Green as Function:** `#1ed760` is strictly reserved for primary actions: Play/Pause toggles, active track highlights, active playback progress bars, and high-intent CTAs.
- **Pill & Circle Geometry:** Primary buttons use `rounded-full` (500px–9999px pill), playback controls use `rounded-full` (50% circle), and card art uses standard `rounded-[6px]`.
- **Systematic Label Voice:** Button labels and section kicker badges feature uppercase typography with tracked letter-spacing (`tracking-wider` / `1.4px–2px`).
- **Heavy Shadow Elevation:** On dark surfaces, subtle shadows disappear. Fysic uses heavy ambient shadows (`rgba(0,0,0,0.5) 0px 8px 24px`) for elevated modals, floating drawers, and now-playing bars.

---

## 2. Color Palette & Roles

```css
:root {
  /* Surface Layers */
  --bg-base: #121212;        /* Deepest canvas & viewport background */
  --bg-surface: #181818;     /* Cards, sidebar, now-playing bar */
  --bg-card: #181818;        /* Content cards (album, playlist) */
  --bg-card-hover: #242424;  /* Card hover state */
  --bg-highlight: #1f1f1f;   /* Interactive pill buttons & inputs */

  /* Primary Brand Accent */
  --accent: #1ed760;         /* Spotify Green - Play buttons, active playback */
  --accent-hover: #1fdf64;   /* Spotify Green hover highlight */
  --accent-pressed: #169c46; /* Spotify Green active/pressed */

  /* Typography Colors */
  --text-main: #ffffff;      /* --text-base: Primary headers, active tracks */
  --text-muted: #b3b3b3;     /* --text-subdued: Artist names, inactive nav, duration */
  --text-faint: #727272;     /* Metadata, timestamps, track numbering */

  /* Borders & Dividers */
  --border-subtle: #282828;  /* Divider lines and subtle panel boundaries */
  --border-light: #4d4d4d;   /* Outlined pill buttons */
  --border-focus: #ffffff;   /* Keyboard focus outline (R-32 compliant) */

  /* Functional Status */
  --status-negative: #f3727f;/* Errors & alerts */
  --status-warning: #ffa42b; /* Buffer & warning states */
  --status-info: #539df5;    /* Informational toasts */
}
```

---

## 3. Typography & Hierarchy

Font Stack: `SpotifyMixUI`, `CircularSp`, `-apple-system`, `BlinkMacSystemFont`, `Inter`, `sans-serif`.

| Role | Font Size | Weight | Tracking | Case | Application |
|---|---|---|---|---|---|
| **Display Title** | 28px–32px | 800 (Extrabold) | -0.02em | Normal | Playlist / Hero Album Title |
| **Section Title** | 22px–24px | 700 (Bold) | -0.01em | Normal | Curated Sections ("Trending", "Made For You") |
| **Card Heading** | 16px | 700 (Bold) | Normal | Normal | Track Name, Playlist Name |
| **Body Standard** | 14px | 400 (Regular) | Normal | Normal | Artist Name, Descriptions, Body Copy |
| **Button Label** | 13px–14px | 700 (Bold) | +0.1em (1.4px) | **UPPERCASE** | Pill CTAs ("PLAY", "UPGRADE", "SAVE") |
| **Nav Item** | 14px | 700 / 400 | Normal | Normal | 700 for Active nav link, 400 for Inactive |
| **Micro Metadata**| 11px–12px | 500 (Medium) | +0.05em | Normal | Duration (03:45), Track Numbering, Bitrate |

---

## 4. Component Design Patterns

### 4.1. Circular Play Button
- **Shape:** Full Circle (`rounded-full`, 50% radius).
- **Background:** Spotify Green (`#1ed760`), Icon color: `#000000` (Pure Black for contrast > 10:1).
- **Behavior:** Scales slightly (`scale-105`) on hover with heavy shadow `shadow-[0_8px_24px_rgba(0,0,0,0.5)]`.

### 4.2. Pill Buttons (Navigation & CTAs)
- **Primary Pill:** `#ffffff` background with `#000000` bold uppercase text, `rounded-full`, `px-6 py-2.5`.
- **Secondary Pill:** `#1f1f1f` background with `#ffffff` text, hover: `#2a2a2a`, `border border-[#333333]`.
- **Outlined Pill:** Transparent background with `#7c7c7c` 1px border, text: `#ffffff`.

### 4.3. Track Row / Album Card
- **Album Card:** Background `#181818`, `rounded-md` (6px-8px). On hover, background shifts to `#242424`, revealing a floating circular play button.
- **Track Row:** Clean table row, 56px height. Left: Track number / animated audio equalizer, Title + Artist; Right: Duration and Add to Playlist action.

### 4.4. Now-Playing Bottom Bar
- **Position:** Fixed bottom, `h-[88px]`, background `#181818` with top border `#282828`.
- **Layout:** 3-Column flexbox (Left: Track Info, Center: Playback & Scrubber, Right: Volume & Queue).
- **Progress Scrubber:** Thin bar (4px) with accent color `#ffffff` on hover and `#1ed760` during active play.

### 4.5. Pill Search Input
- **Container:** `rounded-full` (9999px), background `#1f1f1f` with white text.
- **Padding:** `pl-11 pr-4 py-3`, icon-aware with magnifying glass in `#b3b3b3`.

---

## 5. Anti-Slop & Craftsmanship Compliance (R-01 to R-38)

- **R-02 (Copywriting):** Zero em-dashes (`—`) across all text copy.
- **R-03 (Mobile Layout):** Bottom now-playing bar collapses into compact mobile mini-player (`h-[64px]`), sidebar transforms into mobile bottom tab bar.
- **R-21 (Dark Mode):** Native permanent dark mode with acoustic reasoning (Media playback theater immersion).
- **R-25 (Contrast):** Text white (`#ffffff`) on charcoal (`#121212`) provides 15.8:1 contrast (WCAG AAA). Accent Green on `#000000` icon provides 11.2:1 contrast.
- **R-26 (Interactive):** All buttons and queue controls connect to real playback context. No dummy click targets.
- **R-32 (Keyboard):** Clear focus ring with `outline: 2px solid #1ed760; outline-offset: 2px` on all operable elements.
