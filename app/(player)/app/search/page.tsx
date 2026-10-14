"use client";

import React, { useState } from "react";
import { usePlayer } from "@/lib/player-context";
import { Track } from "@/lib/data/curated-tracks";
import {
  Search,
  Play,
  Plus,
  Volume2,
  Loader2,
  Disc3,
  X,
  Compass,
  AlertCircle
} from "lucide-react";
import { AddToPlaylistModal } from "@/components/add-to-playlist-modal";

const SUGGESTIONS = [
  "Lofi Beats to Study",
  "Indie Akustik Indonesia",
  "Synthwave Cyberpunk",
  "Deep Focus Piano",
  "Chillhop Sunset"
];

export default function SearchPage() {
  const { currentTrack, playTrack } = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);

  const performSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) {
        throw new Error("Pencarian gagal memuat hasil");
      }
      const data = await res.json();
      setResults(data.tracks || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat mencari lagu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none selection:bg-[#1ed760] selection:text-black">
      {/* Search Header & Tactile Pill Bar */}
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cari Katalog Musik
        </h1>
        <p className="text-xs sm:text-sm text-[#b3b3b3]">
          Ketik judul lagu, musisi, atau genre untuk memutar audio resolusi tinggi tanpa jeda iklan.
        </p>

        <form onSubmit={handleSubmit} className="relative flex items-center pt-2">
          <Search className="w-5 h-5 text-[#727272] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Apa yang ingin kamu dengarkan?"
            className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[#181818] border border-[#282828] text-sm text-white placeholder-[#727272] focus:outline-none focus:border-[#1ed760] focus:bg-[#202020] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider mr-1">Rekomendasi:</span>
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSuggestionClick(sug)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222222] text-[#b3b3b3] hover:text-white border border-[#282828] hover:border-[#383838] transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results and State Container */}
      <div>
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#b3b3b3]">
            <Loader2 className="w-8 h-8 text-[#1ed760] animate-spin mb-3" />
            <p className="text-sm font-medium">Menghubungkan ke YouTube Music Resolver...</p>
          </div>
        ) : errorMessage ? (
          <div className="py-16 text-center max-w-md mx-auto p-6 rounded-2xl bg-[#f3727f]/10 border border-[#f3727f]/20 text-[#f3727f]">
            <AlertCircle className="w-8 h-8 text-[#f3727f] mx-auto mb-2" />
            <p className="text-sm font-semibold">{errorMessage}</p>
            <button
              onClick={() => performSearch(query)}
              className="mt-4 px-6 py-2.5 bg-[#f3727f]/20 hover:bg-[#f3727f]/30 text-xs rounded-full font-bold uppercase tracking-wider transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="py-20 text-center text-[#727272] bg-[#181818] border border-[#282828] rounded-2xl p-8 max-w-lg mx-auto">
            <Disc3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-bold text-white">Tidak ada lagu yang cocok dengan pencarian Anda</p>
            <p className="text-xs text-[#727272] mt-1">Coba gunakan kata kunci artis atau judul yang berbeda</p>
          </div>
        ) : !hasSearched ? (
          <div className="py-20 text-center text-[#727272] border border-[#282828] rounded-2xl bg-[#181818]">
            <Compass className="w-10 h-10 text-[#1ed760] mx-auto mb-3 opacity-80" />
            <p className="text-sm font-bold text-white">Temukan Musik Pilihan</p>
            <p className="text-xs text-[#b3b3b3] max-w-sm mx-auto mt-1">
              Gunakan bilah pencarian di atas atau klik salah satu rekomendasi untuk mulai mendengarkan audio secara berurutan.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#282828] bg-[#181818] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-[#282828] text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
              <div className="col-span-1 text-center font-mono">#</div>
              <div className="col-span-6 sm:col-span-5">Judul Lagu</div>
              <div className="hidden sm:block col-span-4">Album</div>
              <div className="col-span-5 sm:col-span-2 text-right">Durasi / Aksi</div>
            </div>

            <div className="divide-y divide-[#242424]">
              {results.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id || currentTrack?.youtubeId === track.youtubeId;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-colors group ${
                      isCurrent ? "bg-[#252525] text-white" : "hover:bg-[#1f1f1f] text-[#b3b3b3]"
                    }`}
                  >
                    {/* Index or Play Indicator */}
                    <div className="col-span-1 text-center font-mono">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-[#1ed760] mx-auto animate-pulse" />
                      ) : (
                        <button
                          onClick={() => playTrack(track, results)}
                          className="text-[#b3b3b3] group-hover:text-white"
                          aria-label={`Putar ${track.title}`}
                        >
                          <span className="group-hover:hidden">{idx + 1}</span>
                          <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block mx-auto text-white" />
                        </button>
                      )}
                    </div>

                    {/* Title & Artist */}
                    <div
                      className="col-span-6 sm:col-span-5 flex items-center gap-3 cursor-pointer min-w-0"
                      onClick={() => playTrack(track, results)}
                    >
                      <img
                        src={track.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                        alt={track.title}
                        className="w-10 h-10 rounded-[4px] object-cover bg-[#242424] shrink-0 border border-white/[0.04]"
                      />
                      <div className="truncate">
                        <p className={`font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white group-hover:underline"}`}>
                          {track.title}
                        </p>
                        <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden sm:block col-span-4 text-[#b3b3b3] truncate">
                      {track.album || "Single"}
                    </div>

                    {/* Duration & Add Button */}
                    <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2 text-right">
                      <span className="font-mono text-[#727272] mr-2">{track.durationText}</span>
                      <button
                        onClick={() => setSelectedTrackForPlaylist(track)}
                        aria-label="Tambah ke Playlist"
                        title="Tambahkan ke Playlist"
                        className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        track={selectedTrackForPlaylist}
        isOpen={!!selectedTrackForPlaylist}
        onClose={() => setSelectedTrackForPlaylist(null)}
      />
    </div>
  );
}
