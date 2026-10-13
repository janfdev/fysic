export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  durationText: string;
  durationSeconds: number;
  streamUrl?: string;
}

export const CURATED_TRACKS: Track[] = [
  {
    id: "612644",
    youtubeId: "612644",
    title: "Lofi Study Flow",
    artist: "Chill Resonance",
    album: "Midnight Sessions Vol. 1",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
    durationText: "0:15",
    durationSeconds: 15,
    streamUrl: "/audio/sample1.mp3"
  },
  {
    id: "612643",
    youtubeId: "612643",
    title: "Subtle Beats & Rain",
    artist: "Quiet Moments",
    album: "Atmosphere",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
    durationText: "0:12",
    durationSeconds: 12,
    streamUrl: "/audio/sample2.mp3"
  },
  {
    id: "612642",
    youtubeId: "612642",
    title: "Warm Acoustic Horizon",
    artist: "Nusantara Indie",
    album: "Senja di Cirebon",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    durationText: "0:14",
    durationSeconds: 14,
    streamUrl: "/audio/sample3.mp3"
  },
  {
    id: "612641",
    youtubeId: "612641",
    title: "Night Drive Synth",
    artist: "Retro Wave ID",
    album: "Jalur Pantura Synth",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80",
    durationText: "0:10",
    durationSeconds: 10,
    streamUrl: "/audio/sample4.mp3"
  },
  {
    id: "sh-song1",
    youtubeId: "sh-song1",
    title: "Ambient Sunset Melodies",
    artist: "SoundHelix Collective",
    album: "Electronic Dreamscape",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    durationText: "6:12",
    durationSeconds: 372,
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "sh-song2",
    youtubeId: "sh-song2",
    title: "Deep Focus Flow",
    artist: "SoundHelix Collective",
    album: "Electronic Dreamscape",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
    durationText: "7:05",
    durationSeconds: 425,
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];
