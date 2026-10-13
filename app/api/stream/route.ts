import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import { CURATED_TRACKS } from "@/lib/data/curated-tracks";

let innertubePlayer: Innertube | null = null;

async function getInnertube(): Promise<Innertube | null> {
  if (innertubePlayer) return innertubePlayer;
  try {
    innertubePlayer = await Innertube.create();
    return innertubePlayer;
  } catch (err) {
    console.warn("Innertube stream client init failed:", err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  // Check if curated track has explicit local/remote stream
  const curated = CURATED_TRACKS.find(t => t.id === id || t.youtubeId === id);
  if (curated?.streamUrl) {
    return NextResponse.json({
      streamUrl: curated.streamUrl,
      source: "curated",
      id
    });
  }

  // Attempt YouTube resolution via Innertube
  try {
    const yt = await getInnertube();
    if (yt) {
      const info = await yt.getInfo(id);
      const format = info.chooseFormat({ type: "audio", quality: "best" });
      if (format) {
        let streamUrl: string | undefined = format.url;
        if (!streamUrl && typeof (format as any).decipher === "function" && yt.session.player) {
          try {
            streamUrl = await (format as any).decipher(yt.session.player);
          } catch (decipherErr) {
            console.warn("Decipher error, using fallback stream:", decipherErr);
          }
        }

        if (streamUrl) {
          return NextResponse.json({
            streamUrl,
            source: "youtube",
            mimeType: format.mime_type,
            id
          });
        }
      }
    }
  } catch (err) {
    console.warn("YouTube audio resolution failed, falling back to reliable stream:", err);
  }

  // Deterministic fallback based on id hash to rotate samples
  const sampleIndex = Math.abs(id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 4 + 1;
  const fallbackUrl = `/audio/sample${sampleIndex}.mp3`;

  return NextResponse.json({
    streamUrl: fallbackUrl,
    source: "fallback",
    id
  });
}
