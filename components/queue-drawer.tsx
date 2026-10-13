"use client";

import React from "react";
import { usePlayer } from "@/lib/player-context";
import { X, Play, Trash2, Volume2, ListMusic } from "lucide-react";

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueueDrawer({ isOpen, onClose }: QueueDrawerProps) {
  const { queue, currentIndex, playTrack, removeFromQueue } = usePlayer();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs select-none"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#161926] border-l border-white/[0.08] h-full pb-[90px] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Antrean Lagu Saat Ini</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {queue.length} Lagu
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Antrean"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {queue.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center">
              <ListMusic className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Antrean putar kosong</p>
              <p className="text-xs text-slate-600 mt-1">Pilih lagu dari pencarian atau playlist</p>
            </div>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-colors group ${
                    isCurrent
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-white"
                      : "bg-[#11131c] border border-white/[0.04] hover:border-white/[0.1] text-slate-300"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => playTrack(track, queue)}
                  >
                    <span className="w-5 text-center text-xs font-mono text-slate-400 shrink-0">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse inline" />
                      ) : (
                        idx + 1
                      )}
                    </span>

                    <img
                      src={track.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-white/[0.06]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? "text-emerald-300" : "text-white"}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {track.durationText || "3:30"}
                    </span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      aria-label="Hapus dari antrean"
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded transition-opacity"
                      title="Hapus lagu ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
