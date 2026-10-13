import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { playlistTracks } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

interface Params {
  params: Promise<{ id: string; trackId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id, trackId } = await params;
    const numericTrackId = Number(trackId);

    if (isNaN(numericTrackId)) {
      return NextResponse.json({ error: "Invalid track ID" }, { status: 400 });
    }

    db.delete(playlistTracks)
      .where(and(eq(playlistTracks.playlistId, id), eq(playlistTracks.id, numericTrackId)))
      .run();

    return NextResponse.json({ success: true, message: "Track removed" });
  } catch (error) {
    console.error("Failed to delete track from playlist:", error);
    return NextResponse.json({ error: "Failed to delete track" }, { status: 500 });
  }
}
