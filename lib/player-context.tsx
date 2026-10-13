"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { Track } from "@/lib/data/curated-tracks";

export type RepeatMode = "off" | "all" | "one";

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (newQueue: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  // Initialize Audio
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.85;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Resolve audio source and play
  const loadAndPlayTrack = useCallback(async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setCurrentTime(0);

    let streamSrc = track.streamUrl;

    if (!streamSrc) {
      try {
        const res = await fetch(`/api/stream?id=${encodeURIComponent(track.youtubeId || track.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.streamUrl) {
            streamSrc = data.streamUrl;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch stream URL, falling back to local sample:", err);
      }
    }

    // Default safe fallback if network fails
    if (!streamSrc) {
      streamSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }

    try {
      audio.src = streamSrc;
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (playErr) {
      console.warn("Audio autoplay blocked or error:", playErr);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  // Sequential Play Next
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
      return;
    }

    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * queue.length);
      setCurrentIndex(nextIdx);
      loadAndPlayTrack(queue[nextIdx]);
      return;
    }

    // Sequential: 100% predictable next index
    if (currentIndex < queue.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      loadAndPlayTrack(queue[nextIdx]);
    } else if (repeatMode === "all") {
      setCurrentIndex(0);
      loadAndPlayTrack(queue[0]);
    } else {
      // End of queue
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [queue, currentIndex, isShuffle, repeatMode, loadAndPlayTrack]);

  // Play Previous
  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setCurrentIndex(prevIdx);
    loadAndPlayTrack(queue[prevIdx]);
  }, [queue, currentIndex, loadAndPlayTrack]);

  // Audio 'ended' listener for sequential progression
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playNext]);

  // MediaSession API Integration (Lockscreen controls)
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    if (currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "Aura Music",
        artwork: [
          {
            src: currentTrack.thumbnail,
            sizes: "512x512",
            type: "image/jpeg"
          }
        ]
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play().catch(console.warn);
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        playNext();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        playPrev();
      });
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    }

    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      }
    };
  }, [currentTrack, playNext, playPrev]);

  // Keyboard Shortcuts (Space, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";
      if (isInput) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, duration, isPlaying]);

  // Play single track
  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id || t.youtubeId === track.youtubeId);
      const finalIdx = idx >= 0 ? idx : 0;
      setCurrentIndex(finalIdx);
      loadAndPlayTrack(newQueue[finalIdx]);
    } else {
      // Append or switch in existing queue
      const existingIdx = queue.findIndex(t => t.id === track.id || t.youtubeId === track.youtubeId);
      if (existingIdx >= 0) {
        setCurrentIndex(existingIdx);
        loadAndPlayTrack(queue[existingIdx]);
      } else {
        const updated = [...queue, track];
        setQueue(updated);
        setCurrentIndex(updated.length - 1);
        loadAndPlayTrack(track);
      }
    }
  }, [queue, loadAndPlayTrack]);

  // Play whole queue starting from index
  const playQueue = useCallback((tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    const validIdx = Math.max(0, Math.min(startIndex, tracks.length - 1));
    setCurrentIndex(validIdx);
    loadAndPlayTrack(tracks[validIdx]);
  }, [loadAndPlayTrack]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (queue.length === 0 && currentTrack === null) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [queue.length, currentTrack]);

  // Seek
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Set volume
  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audio) {
      audio.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Shuffle toggle
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Cycle repeat
  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  // Add to queue
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Remove from queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    if (index === currentIndex) {
      playNext();
    } else if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, playNext]);

  // Reorder queue
  const reorderQueue = useCallback((newQueue: Track[]) => {
    setQueue(newQueue);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        currentIndex,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        playTrack,
        playQueue,
        togglePlay,
        playNext,
        playPrev,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        removeFromQueue,
        reorderQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
