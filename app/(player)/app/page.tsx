"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePlayer } from "@/lib/player-context";
import { CURATED_TRACKS, Track } from "@/lib/data/curated-tracks";
import {
  Play,
  Pause,
  ListOrdered,
  Plus,
  Volume2,
  Disc3,
  Clock,
  Sparkles,
  ArrowRight
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
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayer();
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#161926] via-[#11131c] to-[#0d0f17] border border-white/[0.08] p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Sequential Engine Siap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Selamat Datang di fysic
          </h1>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Putar antrean lagu berurutan dari track 1 hingga akhir tanpa ada interupsi iklan audio dan tanpa shuffle paksa.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayAllCurated}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Putar Rekomendasi Hari Ini</span>
            </button>

            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-sm transition-colors"
            >
              <span>Cari Jutaan Lagu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white tracking-tight">Daftar Playlist Anda</h2>
          <span className="text-xs text-slate-400">{playlists.length} Playlist Tersimpan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              href={`/app/playlist/${pl.id}`}
              className="group p-4 rounded-xl bg-[#11131c] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-[#161926] transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900 mb-3 border border-white/[0.06]">
                <img
                  src={pl.coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300"}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                {pl.title}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-1">
                {pl.trackCount} lagu
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Tracks Table */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Lagu Pilihan Terkurasi</h2>
            <p className="text-xs text-slate-400 mt-0.5">Dapat langsung diputar berurutan</p>
          </div>
          <button
            onClick={handlePlayAllCurated}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            Putar Semua Berurutan
          </button>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#11131c] overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 border-b border-white/[0.06] text-xs font-semibold text-slate-400">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6 sm:col-span-5">Judul Lagu</div>
            <div className="hidden sm:block col-span-4">Album</div>
            <div className="col-span-5 sm:col-span-2 text-right">Durasi / Aksi</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {CURATED_TRACKS.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id || currentTrack?.youtubeId === track.youtubeId;
              return (
                <div
                  key={track.id}
                  className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-colors group ${
                    isCurrent ? "bg-emerald-500/10 text-white" : "hover:bg-white/[0.02] text-slate-300"
                  }`}
                >
                  {/* Number / Play Indicator */}
                  <div className="col-span-1 text-center font-mono">
                    {isCurrent ? (
                      <Volume2 className="w-4 h-4 text-emerald-400 mx-auto animate-pulse" />
                    ) : (
                      <button
                        onClick={() => playTrack(track, CURATED_TRACKS)}
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
                    onClick={() => playTrack(track, CURATED_TRACKS)}
                  >
                    <img
                      src={track.thumbnail}
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
                    {track.album}
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
