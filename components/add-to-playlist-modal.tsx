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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="bg-[#242424] border border-[#383838] rounded-2xl p-6 w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base tracking-tight">Tambahkan ke Playlist</h3>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog"
            className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Track Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181818] border border-[#282828] mb-5">
          <img
            src={track.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
            alt={track.title}
            className="w-11 h-11 rounded-[4px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{track.title}</p>
            <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{track.artist}</p>
          </div>
        </div>

        {/* Existing Playlists */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto mb-4 pr-1">
          {loading ? (
            <div className="p-6 text-center text-[#727272]">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1ed760]" />
              <p className="text-xs">Memuat daftar playlist...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#b3b3b3]">
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
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                    isAdded
                      ? "bg-[#1ed760]/15 border-[#1ed760]/40 text-[#1ed760]"
                      : "bg-[#181818] border-transparent hover:border-[#383838] text-white hover:bg-[#202020]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Music className="w-4 h-4 text-[#727272] shrink-0" />
                    <span className="text-xs font-bold truncate">{pl.title}</span>
                  </div>
                  {isAdded ? (
                    <div className="flex items-center gap-1 text-xs text-[#1ed760] font-bold shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersimpan</span>
                    </div>
                  ) : (
                    <Plus className="w-4 h-4 text-[#727272] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create new playlist inline */}
        {showNewInput ? (
          <form onSubmit={handleCreateAndAdd} className="pt-3 border-t border-[#282828] flex items-center gap-2">
            <input
              type="text"
              required
              placeholder="Nama playlist baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full bg-[#121212] border border-[#383838] text-xs text-white focus:outline-none focus:border-[#1ed760]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold text-xs rounded-full transition-colors uppercase tracking-wider"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowNewInput(false)}
              className="px-3 py-2 text-[#b3b3b3] hover:text-white text-xs uppercase tracking-wider"
            >
              Batal
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowNewInput(true)}
            className="w-full py-2.5 rounded-full border border-dashed border-[#4d4d4d] hover:border-[#1ed760] text-xs font-bold text-[#b3b3b3] hover:text-white flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
          >
            <FolderPlus className="w-4 h-4 text-[#1ed760]" />
            <span>Buat Playlist Baru</span>
          </button>
        )}
      </div>
    </div>
  );
}
