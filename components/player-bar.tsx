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
      <footer className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#181818] border-t border-[#282828] z-30 px-4 sm:px-6 flex items-center justify-between select-none shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
        {/* Left: Track Details */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[180px] max-w-[320px]">
          {currentTrack ? (
            <>
              <div className="relative w-14 h-14 rounded-[6px] overflow-hidden bg-[#242424] shrink-0 border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <img
                  src={currentTrack.thumbnail || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate leading-tight hover:underline cursor-pointer">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-[#b3b3b3] truncate mt-1 hover:underline hover:text-white cursor-pointer">
                  {currentTrack.artist}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-[#b3b3b3]">
              <div className="w-14 h-14 rounded-[6px] bg-[#242424] border border-[#282828] flex items-center justify-center">
                <Disc3 className="w-6 h-6 text-[#727272]" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#b3b3b3]">Belum ada lagu</p>
                <p className="text-[#727272]">Pilih lagu untuk memutar</p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Playback Controls and Progress Bar */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl px-2">
          {/* Controls */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              aria-label="Toggle Shuffle"
              className={`p-1.5 rounded-full transition-colors ${
                isShuffle
                  ? "text-[#1ed760] hover:text-[#1fdf64]"
                  : "text-[#b3b3b3] hover:text-white"
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous Track */}
            <button
              onClick={playPrev}
              disabled={queue.length === 0}
              aria-label="Previous Track"
              className="p-1 text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play and Pause Circular Green Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading || !currentTrack}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-9 h-9 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(30,215,96,0.4)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-black stroke-black" />
              ) : (
                <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={playNext}
              disabled={queue.length === 0}
              aria-label="Next Track"
              className="p-1 text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat Mode */}
            <button
              onClick={cycleRepeat}
              aria-label="Cycle Repeat Mode"
              className={`p-1.5 rounded-full transition-colors ${
                repeatMode !== "off"
                  ? "text-[#1ed760] hover:text-[#1fdf64]"
                  : "text-[#b3b3b3] hover:text-white"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Progress Scrubber */}
          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-[#b3b3b3] select-none">
            <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div
              className="relative flex-1 h-1 bg-[#4d4d4d] hover:h-1.5 rounded-full cursor-pointer transition-all group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seek(pos * duration);
              }}
            >
              <div
                className="absolute top-0 left-0 bottom-0 bg-white group-hover:bg-[#1ed760] rounded-full transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-opacity"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            <span className="w-9 text-left tabular-nums text-[#727272]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume and Queue Controls */}
        <div className="flex items-center justify-end gap-3.5 w-1/4 min-w-[180px] max-w-[320px]">
          {/* Queue Button */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            aria-label="Toggle Queue Drawer"
            className={`p-2 rounded-full transition-colors ${
              isQueueOpen
                ? "text-[#1ed760] bg-[#1f1f1f]"
                : "text-[#b3b3b3] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="text-[#b3b3b3] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#f3727f]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div
              className="relative w-24 h-1 bg-[#4d4d4d] hover:h-1.5 rounded-full cursor-pointer transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setVolume(pos);
              }}
            >
              <div
                className="absolute top-0 left-0 bottom-0 bg-white group-hover:bg-[#1ed760] rounded-full transition-colors"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Queue Drawer Component */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />
    </>
  );
}
