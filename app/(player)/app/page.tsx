"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePlayer } from "@/lib/player-context";
import { CURATED_TRACKS, Track } from "@/lib/data/curated-tracks";
import {
  Play,
  ListOrdered,
  Plus,
  Volume2,
  Disc3,
  Clock,
  ArrowRight,
  Headphones,
  Sparkles
} from "lucide-react";
import { AddToPlaylistModal } from "@/components/add-to-playlist-modal";

interface PlaylistSummary {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  trackCount: number;
}

export default function PlayerHomePage() {
  const { currentTrack, playTrack, playQueue } = usePlayer();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => {
        if (data.playlists) setPlaylists(data.playlists);
      })
      .catch((err) => console.warn("Failed to load playlists:", err));
  }, []);

  const handlePlayAllCurated = () => {
    playQueue(CURATED_TRACKS, 0);
  };

  return (
    <div className="p-3 sm:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 selection:bg-[#1ed760] selection:text-black">
      {/* Hero Welcome Banner: Content-first Spotify Dark Experience */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#202020] via-[#181818] to-[#121212] border border-[#282828] p-5 sm:p-9 overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-4 border border-white/10">
            <ListOrdered className="w-3.5 h-3.5 text-[#1ed760]" />
            <span>Sequential Playback Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            Selamat Datang di fysic
          </h1>

          <p className="text-xs sm:text-base text-[#b3b3b3] mb-6 leading-relaxed max-w-xl">
            Dengarkan musik tanpa jeda, tanpa shuffle paksa, dan tanpa interupsi iklan. Kualitas audio murni dengan resolusi direct streaming YouTube Music.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayAllCurated}
              className="inline-flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(30,215,96,0.35)]"
            >
              <Play className="w-4 h-4 fill-black stroke-black" />
              <span>Putar Rekomendasi</span>
            </button>

            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full font-bold text-white hover:text-white bg-[#1f1f1f] hover:bg-[#282828] border border-[#383838] text-xs uppercase tracking-wider transition-colors"
            >
              <span>Jelajahi Lagu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Playlist Grid: Tactile Spotify Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Daftar Playlist Anda</h2>
          <span className="text-xs text-[#b3b3b3] font-mono">{playlists.length} Playlist Tersimpan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              href={`/app/playlist/${pl.id}`}
              className="group p-4 rounded-xl bg-[#181818] border border-transparent hover:border-[#282828] hover:bg-[#222222] transition-all flex flex-col relative shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <div className="relative aspect-square rounded-[6px] overflow-hidden bg-[#242424] mb-3 shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                <img
                  src={pl.coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300"}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Floating Spotify Circle Play Button on Card Hover */}
                <div className="absolute right-2.5 bottom-2.5 w-11 h-11 rounded-full bg-[#1ed760] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
                  <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
                </div>
              </div>
              <h3 className="font-bold text-sm text-white truncate transition-colors">
                {pl.title}
              </h3>
              <p className="text-xs text-[#b3b3b3] truncate mt-1">
                {pl.trackCount} lagu
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Tracks Table: Spotify-Grade List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Lagu Pilihan Terkurasi</h2>
            <p className="text-xs text-[#b3b3b3] mt-0.5">Dapat langsung diputar berurutan tanpa jeda</p>
          </div>
          <button
            onClick={handlePlayAllCurated}
            className="text-xs font-bold text-[#1ed760] hover:text-[#1fdf64] px-4 py-2 rounded-full border border-[#1ed760]/30 bg-[#1ed760]/10 hover:bg-[#1ed760]/20 transition-all uppercase tracking-wider"
          >
            Putar Semua
          </button>
        </div>

        <div className="rounded-xl border border-[#282828] bg-[#181818] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-12 px-3 sm:px-4 py-3 border-b border-[#282828] text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
            <div className="col-span-1 text-center font-mono">#</div>
            <div className="col-span-8 sm:col-span-6 md:col-span-5">Judul Lagu</div>
            <div className="hidden md:block col-span-3 lg:col-span-4">Album</div>
            <div className="col-span-3 sm:col-span-2 text-right">Durasi / Aksi</div>
          </div>

          <div className="divide-y divide-[#242424]">
            {CURATED_TRACKS.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id || currentTrack?.youtubeId === track.youtubeId;
              return (
                <div
                  key={track.id}
                  className={`grid grid-cols-12 px-3 sm:px-4 py-2.5 sm:py-3 items-center text-xs transition-colors group ${
                    isCurrent ? "bg-[#252525] text-white" : "hover:bg-[#1f1f1f] text-[#b3b3b3]"
                  }`}
                >
                  {/* Number or Play Indicator */}
                  <div className="col-span-1 text-center font-mono">
                    {isCurrent ? (
                      <Volume2 className="w-4 h-4 text-[#1ed760] mx-auto animate-pulse" />
                    ) : (
                      <button
                        onClick={() => playTrack(track, CURATED_TRACKS)}
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
                    className="col-span-8 sm:col-span-6 md:col-span-5 flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0"
                    onClick={() => playTrack(track, CURATED_TRACKS)}
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-[4px] object-cover bg-[#242424] shrink-0 border border-white/[0.04]"
                    />
                    <div className="truncate">
                      <p className={`font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white group-hover:underline"}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{track.artist}</p>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="hidden md:block col-span-3 lg:col-span-4 text-[#b3b3b3] truncate">
                    {track.album}
                  </div>

                  {/* Duration & Add Button */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5 sm:gap-2 text-right">
                    <span className="font-mono text-[#727272] text-[11px] sm:text-xs mr-1">{track.durationText}</span>
                    <button
                      onClick={() => setSelectedTrackForPlaylist(track)}
                      aria-label="Tambah ke Playlist"
                      title="Tambahkan ke Playlist"
                      className="p-1 sm:p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal for adding to playlist */}
      <AddToPlaylistModal
        track={selectedTrackForPlaylist}
        isOpen={!!selectedTrackForPlaylist}
        onClose={() => setSelectedTrackForPlaylist(null)}
      />
    </div>
  );
}
