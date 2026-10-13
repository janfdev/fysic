"use client";

import React, { useState, useEffect } from "react";
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Search Header & Input */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
          Cari Katalog YouTube Music
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          Ketik judul lagu, nama artis, atau album untuk menemukan audio berkualitas tinggi tanpa iklan.
        </p>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lagu, musisi, atau judul playlist..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[#11131c] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[11px] text-slate-500 mr-1">Rekomendasi:</span>
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSuggestionClick(sug)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 border border-white/[0.06] transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div>
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm">Menghubungkan ke YouTube Music Resolver...</p>
          </div>
        ) : errorMessage ? (
          <div className="py-16 text-center max-w-md mx-auto p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">{errorMessage}</p>
            <button
              onClick={() => performSearch(query)}
              className="mt-4 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-xs rounded-lg font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Disc3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm text-slate-400">Tidak ada lagu yang cocok dengan pencarian Anda</p>
            <p className="text-xs text-slate-600 mt-1">Coba gunakan kata kunci artis atau judul yang berbeda</p>
          </div>
        ) : !hasSearched ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-white/[0.08] rounded-2xl">
            <Compass className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">Temukan Lagu Baru</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Gunakan bilah pencarian di atas atau klik salah satu rekomendasi untuk mulai mendengarkan audio secara berurutan.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#11131c] overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-white/[0.06] text-xs font-semibold text-slate-400">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6 sm:col-span-5">Judul Lagu</div>
              <div className="hidden sm:block col-span-4">Album</div>
              <div className="col-span-5 sm:col-span-2 text-right">Durasi / Aksi</div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {results.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id || currentTrack?.youtubeId === track.youtubeId;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-colors group ${
                      isCurrent ? "bg-emerald-500/10 text-white" : "hover:bg-white/[0.02] text-slate-300"
                    }`}
                  >
                    {/* Index / Play Indicator */}
                    <div className="col-span-1 text-center font-mono">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-emerald-400 mx-auto animate-pulse" />
                      ) : (
                        <button
                          onClick={() => playTrack(track, results)}
                          className="text-slate-400 group-hover:text-emerald-400"
                        >
                          <span className="group-hover:hidden">{idx + 1}</span>
                          <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block mx-auto" />
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
                        className="w-9 h-9 rounded-md object-cover bg-slate-900 shrink-0"
                      />
                      <div className="truncate">
                        <p className={`font-semibold truncate ${isCurrent ? "text-emerald-300" : "text-white"}`}>
                          {track.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden sm:block col-span-4 text-slate-400 truncate">
                      {track.album || "Single"}
                    </div>

                    {/* Duration & Add */}
                    <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2 text-right">
                      <span className="font-mono text-slate-400 mr-2">{track.durationText}</span>
                      <button
                        onClick={() => setSelectedTrackForPlaylist(track)}
                        aria-label="Tambah ke Playlist"
                        title="Tambahkan ke Playlist"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
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
