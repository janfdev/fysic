import { NextRequest, NextResponse } from "next/server";
import { CURATED_TRACKS } from "@/lib/data/curated-tracks";
import { resolveAudioUrl } from "@/lib/youtube-resolver";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || "";
  const isRaw = searchParams.get("raw") === "1";

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  // 1. Check curated tracks first
  const curated = CURATED_TRACKS.find(t => t.id === id || t.youtubeId === id);
  let targetAudioUrl: string | null = curated?.streamUrl || null;

  // 2. If not curated, resolve from YouTube via yt-dlp
  if (!targetAudioUrl) {
    targetAudioUrl = await resolveAudioUrl(id);
  }

  // Fallback to high quality full electronic melodic song if resolution fails
  if (!targetAudioUrl) {
    targetAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  }

  // If client requested metadata JSON
  if (!isRaw) {
    return NextResponse.json({
      streamUrl: `/api/stream?id=${encodeURIComponent(id)}&raw=1`,
      source: curated ? "curated" : "youtube",
      id
    });
  }

  // If client (<audio>) requested actual audio stream (raw=1)
  try {
    const rangeHeader = request.headers.get("range") || "bytes=0-";
    const audioRes = await fetch(targetAudioUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Range": rangeHeader
      }
    });

    const headers = new Headers();
    headers.set("Content-Type", audioRes.headers.get("content-type") || "audio/mpeg");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");

    const contentLength = audioRes.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    const contentRange = audioRes.headers.get("content-range");
    if (contentRange) headers.set("Content-Range", contentRange);

    return new Response(audioRes.body, {
      status: audioRes.status,
      headers
    });
  } catch (err: any) {
    console.error("Audio proxy stream error:", err);
    return NextResponse.json({ error: "Stream playback failed" }, { status: 502 });
  }
}
