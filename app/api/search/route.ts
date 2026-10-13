import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import { CURATED_TRACKS, Track } from "@/lib/data/curated-tracks";

// Cache Innertube instance across invocations
let innertubeInstance: Innertube | null = null;

async function getInnertube(): Promise<Innertube | null> {
  if (innertubeInstance) return innertubeInstance;
  try {
    innertubeInstance = await Innertube.create({
      retrieve_player: false
    });
    return innertubeInstance;
  } catch (err) {
    console.warn("Innertube initialization failed:", err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json({
      tracks: CURATED_TRACKS,
      source: "curated"
    });
  }

  try {
    const yt = await getInnertube();
    if (yt) {
      const searchRes = await yt.music.search(query, { type: "song" });
      const shelf = searchRes.contents?.find((c: any) => c.type === "MusicShelf") || searchRes.contents?.[0];
      const items = (shelf as any)?.contents || [];

      if (items.length > 0) {
        const tracks: Track[] = items.map((item: any) => {
          const id = item.id || String(Math.random());
          const title = item.title?.text || item.title || "Unknown Title";
          const artist = Array.isArray(item.artists)
            ? item.artists.map((a: any) => a.name).join(", ")
            : item.author?.name || "Various Artists";
          const album = item.album?.name || "Single";
          const thumbnail = item.thumbnails?.[0]?.url || item.thumbnail?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300";
          const durationText = item.duration?.text || "3:30";
          const durationSeconds = item.duration?.seconds || 210;

          return {
            id,
            youtubeId: id,
            title,
            artist,
            album,
            thumbnail,
            durationText,
            durationSeconds
          };
        });

        return NextResponse.json({
          tracks,
          source: "youtube"
        });
      }
    }
  } catch (err) {
    console.warn("YouTube search error, falling back to curated list:", err);
  }

  // Fallback: Filter curated tracks or return all curated
  const filtered = CURATED_TRACKS.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.artist.toLowerCase().includes(query.toLowerCase()) ||
    t.album.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    tracks: filtered.length > 0 ? filtered : CURATED_TRACKS,
    source: "curated-fallback"
  });
}
