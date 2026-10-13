"use client";

import React, { useState, useEffect } from "react";
import { Track } from "@/lib/data/curated-tracks";
import { X, Plus, Check, FolderPlus, Music, Loader2 } from "lucide-react";

interface AddToPlaylistModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PlaylistOption {
  id: string;
  title: string;
  trackCount: number;
}

export function AddToPlaylistModal({ track, isOpen, onClose }: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<PlaylistOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [showNewInput, setShowNewInput] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSuccessId(null);
      fetchPlaylists();
    }
  }, [isOpen]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data.playlists || []);
      }
    } catch (e) {
      console.warn("Failed to load playlists:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!track) return;
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId: track.youtubeId || track.id,
          title: track.title,
          artist: track.artist,
          album: track.album || "Single",
          thumbnailUrl: track.thumbnail,
          durationSeconds: track.durationSeconds || 0
        })
      });

      if (res.ok) {
        setSuccessId(playlistId);
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      console.error("Add to playlist error:", err);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !track) return;

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.playlist?.id) {
          await handleAddToPlaylist(data.playlist.id);
        }
      }
    } catch (err) {
      console.error("Create and add error:", err);
    }
  };

  if (!isOpen || !track) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="bg-[#161926] border border-white/[0.1] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base">Tambahkan ke Playlist</h3>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Track Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090a0f] border border-white/[0.06] mb-5">
          <img
            src={track.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
            alt={track.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{track.title}</p>
            <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Existing Playlists */}
        <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
          {loading ? (
            <div className="p-6 text-center text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              <p className="text-xs">Memuat daftar playlist...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Belum ada playlist. Buat playlist baru di bawah ini.
            </div>
          ) : (
            playlists.map((pl) => {
              const isAdded = successId === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => handleAddToPlaylist(pl.id)}
                  disabled={isAdded}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors text-left ${
                    isAdded
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                      : "bg-[#11131c] border-white/[0.06] hover:border-white/[0.15] text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Music className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs font-medium truncate">{pl.title}</span>
                  </div>
                  {isAdded ? (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersimpan</span>
                    </div>
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create new playlist inline */}
        {showNewInput ? (
          <form onSubmit={handleCreateAndAdd} className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
            <input
              type="text"
              required
              placeholder="Nama playlist baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#090a0f] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowNewInput(false)}
              className="px-2 py-2 text-slate-400 hover:text-white text-xs"
            >
              Batal
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowNewInput(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.15] hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-emerald-300 flex items-center justify-center gap-2 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Buat Playlist Baru & Simpan</span>
          </button>
        )}
      </div>
    </div>
  );
}
