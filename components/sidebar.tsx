"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Plus,
  Disc3,
  Music,
  ListMusic,
  LogOut,
  FolderPlus,
  X
} from "lucide-react";

interface PlaylistSummary {
  id: string;
  title: string;
  description?: string;
  trackCount: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data.playlists || []);
      }
    } catch (err) {
      console.warn("Failed to load playlists:", err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        setNewTitle("");
        setNewDesc("");
        await fetchPlaylists();
        if (data.playlist?.id) {
          router.push(`/app/playlist/${data.playlist.id}`);
        }
      }
    } catch (err) {
      console.error("Create playlist error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <aside className="w-64 bg-[#121212] border-r border-[#282828] flex flex-col shrink-0 h-[calc(100vh-88px)] select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black group-hover:scale-105 transition-transform shadow-[0_2px_8px_rgba(30,215,96,0.4)]">
              <Disc3 className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">fysic</span>
              <span className="block text-[10px] text-[#1ed760] font-bold tracking-wider uppercase">Spotify Edition</span>
            </div>
          </Link>
        </div>

        {/* Primary Nav Links */}
        <div className="p-3 space-y-1">
          <Link
            href="/app"
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-sm transition-colors ${
              pathname === "/app"
                ? "bg-[#242424] text-white font-bold"
                : "text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] font-normal"
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/app/search"
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-sm transition-colors ${
              pathname === "/app/search"
                ? "bg-[#242424] text-white font-bold"
                : "text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] font-normal"
            }`}
          >
            <Search className="w-5 h-5 shrink-0" />
            <span>Cari Lagu</span>
          </Link>
        </div>

        {/* Playlists Section */}
        <div className="flex-1 flex flex-col min-h-0 px-3 pt-4 border-t border-[#282828]">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider">
              Playlist Saya
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Buat Playlist Baru"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#242424] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {playlists.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#181818] text-center my-2 border border-[#282828]">
                <ListMusic className="w-6 h-6 text-[#727272] mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">Buat playlist pertamamu</p>
                <p className="text-[11px] text-[#b3b3b3] mt-0.5">Koleksi lagu favorit tanpa batas.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                >
                  Buat Playlist
                </button>
              </div>
            ) : (
              playlists.map((pl) => {
                const isActive = pathname === `/app/playlist/${pl.id}`;
                return (
                  <Link
                    key={pl.id}
                    href={`/app/playlist/${pl.id}`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors group ${
                      isActive
                        ? "bg-[#242424] text-white font-bold"
                        : "text-[#b3b3b3] hover:text-white hover:bg-[#181818]"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-7 h-7 rounded-[4px] bg-[#242424] flex items-center justify-center shrink-0 border border-white/[0.04]">
                        <Music className={`w-3.5 h-3.5 ${isActive ? "text-[#1ed760]" : "text-[#727272] group-hover:text-white"}`} />
                      </div>
                      <span className="truncate">{pl.title}</span>
                    </div>
                    <span className="text-[10px] text-[#727272] font-mono shrink-0 ml-2">
                      {pl.trackCount}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info and Logout */}
        <div className="p-3 border-t border-[#282828] flex items-center justify-between text-xs text-[#b3b3b3]">
          <Link href="/" className="hover:text-white transition-colors">
            Tentang fysic
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/me", { method: "POST" });
              router.push("/login");
            }}
            title="Keluar"
            className="flex items-center gap-1.5 hover:text-[#f3727f] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Create Playlist Modal with Spotify Dark Tokens */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsModalOpen(false);
          }}
        >
          <div className="bg-[#242424] border border-[#383838] rounded-xl p-6 w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/30 flex items-center justify-center text-[#1ed760]">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Buat Playlist Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                  Nama Playlist
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fokus Koding Malam"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#121212] border border-[#383838] text-white text-sm focus:border-[#1ed760] focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Daftar lagu untuk menemani koding..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#121212] border border-[#383838] text-white text-sm focus:border-[#1ed760] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#b3b3b3] hover:text-white transition-colors uppercase tracking-wider"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black transition-all disabled:opacity-50 uppercase tracking-wider shadow-[0_4px_12px_rgba(30,215,96,0.3)]"
                >
                  {isSubmitting ? "Menyimpan..." : "Buat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
