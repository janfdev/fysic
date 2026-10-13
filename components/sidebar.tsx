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
      <aside className="w-64 bg-[#11131c] border-r border-white/[0.08] flex flex-col shrink-0 h-[calc(100vh-84px)] select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Disc3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">Aura Music</span>
              <span className="block text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Sequential</span>
            </div>
          </Link>
        </div>

        {/* Primary Nav Links */}
        <div className="p-3 space-y-1">
          <Link
            href="/app"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/app"
                ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/app/search"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/app/search"
                ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Cari Lagu</span>
          </Link>
        </div>

        {/* Playlists Section */}
        <div className="flex-1 flex flex-col min-h-0 px-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Playlist Saya
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Buat Playlist Baru"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {playlists.length === 0 ? (
              <div className="p-4 text-center">
                <ListMusic className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Belum ada playlist</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-xs text-emerald-400 hover:underline"
                >
                  Buat playlist pertama
                </button>
              </div>
            ) : (
              playlists.map((pl) => {
                const isActive = pathname === `/app/playlist/${pl.id}`;
                return (
                  <Link
                    key={pl.id}
                    href={`/app/playlist/${pl.id}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-300 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Music className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                      <span className="truncate">{pl.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      {pl.trackCount}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200 transition-colors">
            Tentang Aura
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/me", { method: "POST" });
              router.push("/login");
            }}
            title="Keluar"
            className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Create Playlist Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsModalOpen(false);
          }}
        >
          <div className="bg-[#161926] border border-white/[0.1] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Buat Playlist Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nama Playlist
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fokus Koding Malam"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.12] text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Daftar lagu untuk menemani koding..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.12] text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Buat Playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
