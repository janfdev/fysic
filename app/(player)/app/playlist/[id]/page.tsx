"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/lib/player-context";
import { Track } from "@/lib/data/curated-tracks";
import {
  Play,
  Volume2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ListOrdered,
  Plus,
  Clock,
  Disc3,
  Loader2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface PlaylistTrackItem {
  id: number;
  playlistId: string;
  youtubeId: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  sortOrder: number;
}

interface PlaylistDetail {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
}

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { currentTrack, playTrack, playQueue } = usePlayer();

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [tracks, setTracks] = useState<PlaylistTrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylistData = async () => {
    try {
      const res = await fetch(`/api/playlists/${id}`);
      if (!res.ok) {
        throw new Error("Playlist tidak ditemukan");
      }
      const data = await res.json();
      setPlaylist(data.playlist);
      setTracks(data.tracks || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  // Convert PlaylistTrackItem to Player Track
  const convertToPlayerTrack = (item: PlaylistTrackItem): Track => ({
    id: String(item.id),
    youtubeId: item.youtubeId,
    title: item.title,
    artist: item.artist,
    album: item.album || "Single",
    thumbnail: item.thumbnailUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120",
    durationSeconds: item.durationSeconds,
    durationText: `${Math.floor(item.durationSeconds / 60)}:${(item.durationSeconds % 60).toString().padStart(2, "0")}`
  });

  const handlePlaySequential = () => {
    if (tracks.length === 0) return;
    const playerQueue = tracks.map(convertToPlayerTrack);
    playQueue(playerQueue, 0);
  };

  const handlePlaySingle = (item: PlaylistTrackItem) => {
    const playerQueue = tracks.map(convertToPlayerTrack);
    const track = convertToPlayerTrack(item);
    playTrack(track, playerQueue);
  };

  const handleDeleteTrack = async (trackId: number) => {
    try {
      const res = await fetch(`/api/playlists/${id}/tracks/${trackId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setTracks(prev => prev.filter(t => t.id !== trackId));
      }
    } catch (err) {
      console.error("Failed to delete track:", err);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tracks.length) return;

    const newTracks = [...tracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[targetIndex];
    newTracks[targetIndex] = temp;

    // Update sortOrder values
    const trackOrders = newTracks.map((t, idx) => ({
      id: t.id,
      sortOrder: idx
    }));

    setTracks(newTracks);

    try {
      await fetch(`/api/playlists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackOrders })
      });
    } catch (err) {
      console.error("Failed to update track order:", err);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus playlist ini?")) return;
    try {
      const res = await fetch(`/api/playlists/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/app");
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#b3b3b3]">
        <Loader2 className="w-8 h-8 text-[#1ed760] animate-spin mb-3" />
        <p className="text-sm font-medium">Memuat detail playlist...</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <Disc3 className="w-12 h-12 text-[#727272] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Playlist Tidak Ditemukan</h2>
        <p className="text-xs text-[#b3b3b3] mb-6">{error || "Playlist yang Anda cari tidak tersedia."}</p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1ed760] text-black font-bold text-xs rounded-full uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const totalDurationSecs = tracks.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
  const totalDurationMin = Math.floor(totalDurationSecs / 60);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Spotify Heroic Playlist Banner */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#282828] via-[#1a1a1a] to-[#121212] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-[6px] overflow-hidden bg-[#242424] shrink-0 border border-white/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <img
            src={playlist.coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 block">
            Daftar Putar Publik
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight truncate mb-3">
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="text-xs sm:text-sm text-[#b3b3b3] mb-4 max-w-xl">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-[#b3b3b3] mb-6 font-medium">
            <span className="text-white font-bold">{tracks.length} lagu</span>
            <span>•</span>
            <span>sekitar {totalDurationMin} menit</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Spotify Green Big Circular Play */}
            <button
              onClick={handlePlaySequential}
              disabled={tracks.length === 0}
              aria-label="Putar Berurutan"
              className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-[0_8px_20px_rgba(30,215,96,0.4)] disabled:opacity-40"
            >
              <Play className="w-6 h-6 fill-black stroke-black ml-1" />
            </button>

            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white bg-[#1f1f1f] hover:bg-[#282828] border border-[#383838] text-xs uppercase tracking-wider transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Lagu</span>
            </Link>

            <button
              onClick={handleDeletePlaylist}
              aria-label="Hapus Playlist"
              title="Hapus Playlist Ini"
              className="p-3 rounded-full text-[#727272] hover:text-[#f3727f] hover:bg-white/[0.04] transition-colors ml-auto"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracks Table — Spotify Layout */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-[#1ed760]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Daftar Urutan Pemutaran</h2>
          </div>
          <span className="text-xs text-[#727272]">Gunakan panah untuk mengatur alur antrean</span>
        </div>

        {tracks.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#282828] rounded-2xl p-8 bg-[#181818]/40">
            <Disc3 className="w-12 h-12 text-[#727272] mx-auto mb-3" />
            <p className="text-base font-bold text-white">Playlist ini masih kosong</p>
            <p className="text-xs text-[#b3b3b3] mt-1 mb-5">
              Cari lagu dari YouTube Music dan susun ke playlist ini.
            </p>
            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Cari Lagu Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-[#282828] bg-[#181818] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-[#282828] text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
              <div className="col-span-1 text-center font-mono">#</div>
              <div className="col-span-6 sm:col-span-5">Judul Lagu</div>
              <div className="hidden sm:block col-span-3">Album</div>
              <div className="col-span-5 sm:col-span-3 text-right">Durasi & Urutan</div>
            </div>

            <div className="divide-y divide-[#242424]">
              {tracks.map((item, idx) => {
                const isCurrent = currentTrack?.youtubeId === item.youtubeId || currentTrack?.id === String(item.id);
                const durationFormatted = `${Math.floor(item.durationSeconds / 60)}:${(item.durationSeconds % 60).toString().padStart(2, "0")}`;

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-colors group ${
                      isCurrent ? "bg-[#282828] text-white" : "hover:bg-[#202020] text-[#b3b3b3]"
                    }`}
                  >
                    {/* Position / Play Indicator */}
                    <div className="col-span-1 text-center font-mono">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-[#1ed760] mx-auto animate-pulse" />
                      ) : (
                        <button
                          onClick={() => handlePlaySingle(item)}
                          className="text-[#b3b3b3] group-hover:text-white"
                        >
                          <span className="group-hover:hidden">{idx + 1}</span>
                          <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block mx-auto text-white" />
                        </button>
                      )}
                    </div>

                    {/* Title & Artist */}
                    <div
                      className="col-span-6 sm:col-span-5 flex items-center gap-3 cursor-pointer min-w-0"
                      onClick={() => handlePlaySingle(item)}
                    >
                      <img
                        src={item.thumbnailUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                        alt={item.title}
                        className="w-10 h-10 rounded-[4px] object-cover bg-[#242424] shrink-0 border border-white/[0.04]"
                      />
                      <div className="truncate">
                        <p className={`font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white group-hover:underline"}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{item.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden sm:block col-span-3 text-[#b3b3b3] truncate">
                      {item.album || "Single"}
                    </div>

                    {/* Duration, Reorder & Delete */}
                    <div className="col-span-5 sm:col-span-3 flex items-center justify-end gap-1.5 text-right">
                      <span className="font-mono text-[#727272] mr-2">{durationFormatted}</span>

                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        aria-label="Pindah ke Atas"
                        title="Pindah ke Atas"
                        className="p-1 rounded text-[#727272] hover:text-white disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === tracks.length - 1}
                        aria-label="Pindah ke Bawah"
                        title="Pindah ke Bawah"
                        className="p-1 rounded text-[#727272] hover:text-white disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Track */}
                      <button
                        onClick={() => handleDeleteTrack(item.id)}
                        aria-label="Hapus dari Playlist"
                        title="Hapus Lagu Ini"
                        className="p-1 rounded text-[#727272] hover:text-[#f3727f] hover:bg-[#f3727f]/10 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
