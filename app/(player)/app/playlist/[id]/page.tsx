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
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm">Memuat detail playlist...</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <Disc3 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Playlist Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400 mb-6">{error || "Playlist yang Anda cari tidak tersedia."}</p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg"
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
      {/* Playlist Header Card */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end p-6 rounded-2xl bg-gradient-to-b from-[#161926] to-[#11131c] border border-white/[0.08]">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/[0.08] shadow-2xl">
          <img
            src={playlist.coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 block">
            Playlist Kustom
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight truncate mb-2">
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="text-xs sm:text-sm text-slate-400 mb-4 max-w-xl">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
            <span>{tracks.length} lagu</span>
            <span>•</span>
            <span>{totalDurationMin} menit</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlaySequential}
              disabled={tracks.length === 0}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Putar Berurutan</span>
            </button>

            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Lagu</span>
            </Link>

            <button
              onClick={handleDeletePlaylist}
              aria-label="Hapus Playlist"
              title="Hapus Playlist Ini"
              className="p-3 rounded-xl text-slate-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracks Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Daftar Urutan Pemutaran</h2>
          </div>
          <span className="text-xs text-slate-400">Gunakan panah untuk mengatur alur antrean</span>
        </div>

        {tracks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl p-8">
            <Disc3 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Playlist ini belum memiliki lagu</p>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Cari lagu dari YouTube Music dan tambahkan ke playlist ini.
            </p>
            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Cari Lagu Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#11131c] overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-white/[0.06] text-xs font-semibold text-slate-400">
              <div className="col-span-1 text-center">Urutan</div>
              <div className="col-span-6 sm:col-span-5">Judul Lagu</div>
              <div className="hidden sm:block col-span-3">Album</div>
              <div className="col-span-5 sm:col-span-3 text-right">Durasi & Urutan</div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {tracks.map((item, idx) => {
                const isCurrent = currentTrack?.youtubeId === item.youtubeId || currentTrack?.id === String(item.id);
                const durationFormatted = `${Math.floor(item.durationSeconds / 60)}:${(item.durationSeconds % 60).toString().padStart(2, "0")}`;

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-colors group ${
                      isCurrent ? "bg-emerald-500/10 text-white" : "hover:bg-white/[0.02] text-slate-300"
                    }`}
                  >
                    {/* Position / Play Indicator */}
                    <div className="col-span-1 text-center font-mono">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-emerald-400 mx-auto animate-pulse" />
                      ) : (
                        <button
                          onClick={() => handlePlaySingle(item)}
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
                      onClick={() => handlePlaySingle(item)}
                    >
                      <img
                        src={item.thumbnailUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                        alt={item.title}
                        className="w-9 h-9 rounded-md object-cover bg-slate-900 shrink-0"
                      />
                      <div className="truncate">
                        <p className={`font-semibold truncate ${isCurrent ? "text-emerald-300" : "text-white"}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{item.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden sm:block col-span-3 text-slate-400 truncate">
                      {item.album || "Single"}
                    </div>

                    {/* Duration, Reorder & Delete */}
                    <div className="col-span-5 sm:col-span-3 flex items-center justify-end gap-1.5 text-right">
                      <span className="font-mono text-slate-400 mr-2">{durationFormatted}</span>

                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        aria-label="Pindah ke Atas"
                        title="Pindah ke Atas"
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === tracks.length - 1}
                        aria-label="Pindah ke Bawah"
                        title="Pindah ke Bawah"
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Track */}
                      <button
                        onClick={() => handleDeleteTrack(item.id)}
                        aria-label="Hapus dari Playlist"
                        title="Hapus Lagu Ini"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
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
