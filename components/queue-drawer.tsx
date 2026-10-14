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
      className="fixed inset-0 z-40 flex justify-end bg-black/70 backdrop-blur-xs select-none"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#181818] border-l border-[#282828] h-full pb-[96px] flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.6)] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-[#1ed760]" />
            <h3 className="font-bold text-white text-base">Antrean Putar</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/20 font-bold">
              {queue.length} Lagu
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Antrean"
            className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {queue.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-[#727272] text-center">
              <ListMusic className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#b3b3b3]">Antrean putar kosong</p>
              <p className="text-xs text-[#727272] mt-1">Pilih lagu dari pencarian atau playlist</p>
            </div>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-colors group ${
                    isCurrent
                      ? "bg-[#282828] text-white"
                      : "bg-[#1f1f1f] border border-transparent hover:border-[#282828] hover:bg-[#242424] text-[#b3b3b3]"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => playTrack(track, queue)}
                  >
                    <span className="w-5 text-center text-xs font-mono text-[#727272] shrink-0">
                      {isCurrent ? (
                        <Volume2 className="w-4 h-4 text-[#1ed760] animate-pulse inline" />
                      ) : (
                        idx + 1
                      )}
                    </span>

                    <img
                      src={track.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                      alt={track.title}
                      className="w-10 h-10 rounded-[4px] object-cover bg-[#242424] shrink-0 border border-white/[0.04]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white group-hover:underline"}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-[11px] font-mono text-[#727272]">
                      {track.durationText || "3:30"}
                    </span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      aria-label="Hapus dari antrean"
                      className="opacity-0 group-hover:opacity-100 text-[#727272] hover:text-[#f3727f] p-1 rounded transition-opacity"
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
