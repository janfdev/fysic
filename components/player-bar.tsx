"use client";

import React, { useState } from "react";
import { usePlayer } from "@/lib/player-context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Disc3,
  Loader2
} from "lucide-react";
import { QueueDrawer } from "./queue-drawer";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function PlayerBar() {
  const {
    currentTrack,
    queue,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat
  } = usePlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 h-[84px] bg-[#11131c] border-t border-white/[0.08] z-30 px-4 sm:px-6 flex items-center justify-between select-none">
        {/* Left: Track Details */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[180px] max-w-[320px]">
          {currentTrack ? (
            <>
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#161926] shrink-0 border border-white/[0.08] shadow-md">
                <img
                  src={currentTrack.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate leading-tight">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-12 h-12 rounded-lg bg-[#161926] border border-white/[0.06] flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-slate-600" />
              </div>
              <div className="text-xs">
                <p className="font-medium text-slate-400">Belum ada lagu</p>
                <p className="text-slate-600">Pilih lagu untuk memutar</p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl px-2">
          {/* Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              aria-label="Toggle Shuffle"
              className={`p-1.5 rounded-lg transition-colors ${
                isShuffle
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-400 hover:text-white"
              }`}
              title={isShuffle ? "Shuffle Aktif" : "Shuffle Mati"}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrev}
              disabled={queue.length === 0}
              aria-label="Lagu Sebelumnya"
              className="text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 p-1.5 transition-colors"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              disabled={queue.length === 0 && !currentTrack}
              aria-label={isPlaying ? "Jeda" : "Putar"}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              disabled={queue.length === 0}
              aria-label="Lagu Berikutnya"
              className="text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 p-1.5 transition-colors"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              aria-label="Toggle Repeat"
              className={`p-1.5 rounded-lg transition-colors relative ${
                repeatMode !== "off"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-400 hover:text-white"
              }`}
              title={`Mode Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Timeline slider */}
          <div className="flex items-center gap-3 w-full text-[11px] font-mono text-slate-400">
            <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="flex-1 relative flex items-center group py-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Progress Slider"
                className="w-full h-1 bg-white/[0.12] rounded-full appearance-none cursor-pointer accent-emerald-400 group-hover:h-1.5 transition-all"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255,255,255,0.12) ${progressPercent}%)`
                }}
              />
            </div>
            <span className="w-9 text-left tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Queue & Volume */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[140px] max-w-[260px]">
          {/* Queue Drawer Toggle */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            aria-label="Daftar Antrean Putar"
            className={`p-2 rounded-lg flex items-center gap-1.5 text-xs transition-colors relative ${
              isQueueOpen
                ? "bg-emerald-500/10 text-emerald-300"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span className="text-[11px] font-medium hidden sm:inline">{queue.length}</span>
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Aktifkan Suara" : "Senyapkan Suara"}
              className="text-slate-400 hover:text-white p-1 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume Slider"
              className="w-20 h-1 bg-white/[0.15] rounded-full appearance-none cursor-pointer accent-emerald-400 hover:h-1.5 transition-all"
            />
          </div>
        </div>
      </footer>

      {/* Queue Drawer Modal/Panel */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </>
  );
}
