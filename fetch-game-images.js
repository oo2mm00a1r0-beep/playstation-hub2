/**
 * fetch-game-images.js
 *
 * Fetches 1 cover image + 3 gameplay screenshots per game from the RAWG API
 * and updates the `images` column (text[] array) in the Supabase `products` table.
 *
 * Requirements:
 *   npm install @supabase/supabase-js dotenv
 *
 * .env must contain:
 *   SUPABASE_URL=...
 *   SUPABASE_ANON_KEY=...  (or NEXT_PUBLIC_SUPABASE_ANON_KEY, script checks both)
 *   RAWG_API_KEY=...
 *
 * Run:
 *   node fetch-game-images.js
 *
 * Safe to re-run: games that already have 4+ images are skipped automatically.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// ---------- CONFIG ----------
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RAWG_API_KEY = process.env.RAWG_API_KEY;

const BATCH_SIZE = 10; // how many games processed before a progress print
const DELAY_MS = 350; // delay between RAWG requests to avoid rate limiting

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}
if (!RAWG_API_KEY) {
  console.error('❌ Missing RAWG_API_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Strip stuff like "(Used)", "(Sealed)", "(Arabic + English)", "(Steelbook Edition)" etc.
// to improve RAWG search match quality. We search with the cleaned name.
function cleanGameName(name) {
  return name
    .replace(/\(.*?\)/g, '') // remove parenthetical notes
    .replace(/[:\-–]\s*(steelbook|complete|ultimate|legacy|deluxe)\s*edition/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchRawgGame(name) {
  const query = encodeURIComponent(cleanGameName(name));
  const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}&page_size=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG search failed (${res.status})`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  return data.results[0]; // best match
}

async function getRawgScreenshots(gameId) {
  const url = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${RAWG_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG screenshots failed (${res.status})`);
  const data = await res.json();
  return (data.results || []).map((s) => s.image);
}

async function fetchImagesForGame(name) {
  const match = await searchRawgGame(name);
  if (!match) return null;

  const cover = match.background_image;
  if (!cover) return null;

  const screenshots = await getRawgScreenshots(match.id);
  // Take up to 3 gameplay screenshots, avoid duplicating the cover image
  const gameplay = screenshots.filter((s) => s !== cover).slice(0, 3);

  if (gameplay.length < 3) return null; // not enough images to satisfy "4 images" requirement

  return [cover, ...gameplay]; // [cover, gameplay1, gameplay2, gameplay3]
}

async function main() {
  console.log('📦 Fetching games from Supabase (category = Games)...\n');

  const { data: games, error } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('category', 'Games');

  if (error) {
    console.error('❌ Failed to fetch products:', error.message);
    process.exit(1);
  }

  console.log(`Found ${games.length} games total.\n`);

  const succeeded = [];
  const skipped = [];
  const failed = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    // Skip if already has 4+ images
    if (Array.isArray(game.images) && game.images.length >= 4) {
      skipped.push({ name: game.name, reason: 'already has images' });
      continue;
    }

    try {
      const images = await fetchImagesForGame(game.name);

      if (!images) {
        failed.push({ name: game.name, reason: 'no match or insufficient images on RAWG' });
        await sleep(DELAY_MS);
        continue;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({ images })
        .eq('id', game.id);

      if (updateError) {
        failed.push({ name: game.name, reason: `DB update failed: ${updateError.message}` });
      } else {
        succeeded.push(game.name);
      }
    } catch (err) {
      failed.push({ name: game.name, reason: err.message });
    }

    await sleep(DELAY_MS);

    if ((i + 1) % BATCH_SIZE === 0 || i === games.length - 1) {
      console.log(
        `Progress: ${i + 1}/${games.length}  ✅ ${succeeded.length}  ⏭️ ${skipped.length}  ❌ ${failed.length}`
      );
    }
  }

  console.log('\n========== FINAL REPORT ==========');
  console.log(`✅ Successfully updated: ${succeeded.length}`);
  console.log(`⏭️  Skipped (already had images): ${skipped.length}`);
  console.log(`❌ Failed/No match: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n--- Failed games (review these manually) ---');
    failed.forEach((f) => console.log(`  - ${f.name}  (${f.reason})`));
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
