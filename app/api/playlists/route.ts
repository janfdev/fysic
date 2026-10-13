import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { playlists, playlistTracks } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const list = db.select({
      id: playlists.id,
      title: playlists.title,
      description: playlists.description,
      coverUrl: playlists.coverUrl,
      createdAt: playlists.createdAt,
      updatedAt: playlists.updatedAt,
      trackCount: sql<number>`count(${playlistTracks.id})`.mapWith(Number)
    })
    .from(playlists)
    .leftJoin(playlistTracks, eq(playlists.id, playlistTracks.playlistId))
    .groupBy(playlists.id)
    .orderBy(desc(playlists.createdAt))
    .all();

    return NextResponse.json({ playlists: list });
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, coverUrl } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const id = "pl_" + Math.random().toString(36).substring(2, 9);
    const now = new Date();

    const newPlaylist = {
      id,
      userId: "user-demo",
      title: title.trim(),
      description: description?.trim() || "",
      coverUrl: coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
      createdAt: now,
      updatedAt: now
    };

    db.insert(playlists).values(newPlaylist).run();

    return NextResponse.json({ playlist: newPlaylist }, { status: 201 });
  } catch (error) {
    console.error("Failed to create playlist:", error);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
