import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

// Memory cache for stream URLs (valid for ~4 hours on YouTube CDN)
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL_MS = 4 * 60 * 60 * 1000;

export async function resolveAudioUrl(videoId: string): Promise<string | null> {
  // Check cache first
  const cached = urlCache.get(videoId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.url;
  }

  try {
    const { stdout } = await exec("yt-dlp", [
      "-g",
      "-f",
      "bestaudio",
      "--no-playlist",
      `https://www.youtube.com/watch?v=${videoId}`
    ], { timeout: 15000 });

    const streamUrl = stdout.trim().split("\n")[0];
    if (streamUrl && streamUrl.startsWith("http")) {
      urlCache.set(videoId, { url: streamUrl, timestamp: Date.now() });
      return streamUrl;
    }
  } catch (err: any) {
    console.warn(`yt-dlp resolution failed for ${videoId}:`, err?.message || err);
  }

  return null;
}
