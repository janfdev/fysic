import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { playlists, playlistTracks } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const playlist = db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const tracks = db.select().from(playlistTracks)
      .where(eq(playlistTracks.playlistId, id))
      .orderBy(asc(playlistTracks.sortOrder), asc(playlistTracks.id))
      .all();

    return NextResponse.json({
      playlist,
      tracks
    });
  } catch (error) {
    console.error("Failed to get playlist:", error);
    return NextResponse.json({ error: "Failed to get playlist" }, { status: 500 });
  }
}

// Add a track to this playlist
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const playlist = db.select().from(playlists).where(eq(playlists.id, id)).get();

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const body = await request.json();
    const { youtubeId, title, artist, album, thumbnailUrl, durationSeconds } = body;

    if (!youtubeId || !title || !artist) {
      return NextResponse.json({ error: "Missing required track fields" }, { status: 400 });
    }

    // Get current max sortOrder
    const existing = db.select().from(playlistTracks).where(eq(playlistTracks.playlistId, id)).all();
    const nextOrder = existing.length > 0 ? Math.max(...existing.map(t => t.sortOrder)) + 1 : 0;

    const newTrack = {
      playlistId: id,
      youtubeId,
      title,
      artist,
      album: album || "Single",
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120",
      durationSeconds: Number(durationSeconds) || 0,
      sortOrder: nextOrder,
      createdAt: new Date()
    };

    const inserted = db.insert(playlistTracks).values(newTrack).returning().get();

    return NextResponse.json({ track: inserted }, { status: 201 });
  } catch (error) {
    console.error("Failed to add track to playlist:", error);
    return NextResponse.json({ error: "Failed to add track" }, { status: 500 });
  }
}

// Update playlist or reorder tracks
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Track reordering: { trackOrders: { id: number, sortOrder: number }[] }
    if (body.trackOrders && Array.isArray(body.trackOrders)) {
      for (const item of body.trackOrders) {
        db.update(playlistTracks)
          .set({ sortOrder: item.sortOrder })
          .where(eq(playlistTracks.id, item.id))
          .run();
      }
      return NextResponse.json({ success: true, message: "Tracks reordered" });
    }

    // Update title/description
    const { title, description } = body;
    const updates: Partial<{ title: string; description: string; updatedAt: Date }> = {
      updatedAt: new Date()
    };
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();

    db.update(playlists).set(updates).where(eq(playlists.id, id)).run();

    return NextResponse.json({ success: true, message: "Playlist updated" });
  } catch (error) {
    console.error("Failed to update playlist:", error);
    return NextResponse.json({ error: "Failed to update playlist" }, { status: 500 });
  }
}

// Delete playlist
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Delete tracks first then playlist
    db.delete(playlistTracks).where(eq(playlistTracks.playlistId, id)).run();
    db.delete(playlists).where(eq(playlists.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}
