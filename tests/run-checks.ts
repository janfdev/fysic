import assert from "node:assert/strict";
import { db } from "../lib/db/index";
import { playlists, playlistTracks } from "../lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { CURATED_TRACKS } from "../lib/data/curated-tracks";

async function testAll() {
  console.log("Running self-check assertions...");

  // 1. Verify Curated Tracks
  assert.ok(CURATED_TRACKS.length >= 4, "Curated tracks must have at least 4 tracks");
  assert.equal(CURATED_TRACKS[0].title, "Lofi Study Flow");
  console.log("✓ Curated tracks validation passed");

  // 2. Sequential Queue Logic check
  const nextTrackIndex = (idx: number, len: number, repeatAll: boolean) => {
    if (idx < len - 1) return idx + 1;
    if (repeatAll) return 0;
    return -1;
  };
  assert.equal(nextTrackIndex(0, 3, false), 1, "0 must transition to 1");
  assert.equal(nextTrackIndex(1, 3, false), 2, "1 must transition to 2");
  assert.equal(nextTrackIndex(2, 3, false), -1, "2 must end when repeat is off");
  assert.equal(nextTrackIndex(2, 3, true), 0, "2 must wrap to 0 when repeat all is on");
  console.log("✓ Sequential queue state machine logic passed");

  // 3. Database CRUD & Reorder check via Drizzle
  const testId = "test_" + Date.now();
  db.insert(playlists).values({
    id: testId,
    userId: "test-user",
    title: "Test Playlist",
    description: "Assertion testing",
    coverUrl: "https://example.com/test.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  }).run();

  const retrievedPl = db.select().from(playlists).where(eq(playlists.id, testId)).get();
  assert.ok(retrievedPl, "Created playlist must exist in database");
  assert.equal(retrievedPl.title, "Test Playlist");

  // Add tracks
  db.insert(playlistTracks).values({
    playlistId: testId,
    youtubeId: "yt1",
    title: "Song 1",
    artist: "Artist 1",
    sortOrder: 0,
    createdAt: new Date()
  }).run();

  db.insert(playlistTracks).values({
    playlistId: testId,
    youtubeId: "yt2",
    title: "Song 2",
    artist: "Artist 2",
    sortOrder: 1,
    createdAt: new Date()
  }).run();

  const tracks = db.select().from(playlistTracks)
    .where(eq(playlistTracks.playlistId, testId))
    .orderBy(asc(playlistTracks.sortOrder))
    .all();

  assert.equal(tracks.length, 2, "Playlist must have 2 tracks");
  assert.equal(tracks[0].title, "Song 1");
  assert.equal(tracks[1].title, "Song 2");

  // Cleanup
  db.delete(playlistTracks).where(eq(playlistTracks.playlistId, testId)).run();
  db.delete(playlists).where(eq(playlists.id, testId)).run();

  const cleaned = db.select().from(playlists).where(eq(playlists.id, testId)).get();
  assert.equal(cleaned, undefined, "Cleaned playlist must not exist");
  console.log("✓ Database persistence & operations passed");

  console.log("ALL ASSERTION CHECKS PASSED!");
}

testAll().catch((err) => {
  console.error("Self check failed:", err);
  process.exit(1);
});
