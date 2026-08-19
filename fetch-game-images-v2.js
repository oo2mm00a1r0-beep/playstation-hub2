/**
 * fetch-game-images-v2.js
 *
 * Same as fetch-game-images.js, but calls the `update_game_images` RPC function
 * (created via update_game_images_migration.sql) instead of a direct table update.
 * This works around RLS silently blocking anonymous UPDATEs, and VERIFIES the
 * update actually affected a row before counting it as a success.
 *
 * Requirements:
 *   npm install @supabase/supabase-js dotenv
 *
 * .env must contain:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *   RAWG_API_KEY
 *
 * Run:
 *   node fetch-game-images-v2.js
 *
 * This will RE-PROCESS every game in the Games category (including ones
 * previously "marked successful" by the old buggy script), because those
 * updates never actually took effect.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// ---------- CONFIG ----------
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RAWG_API_KEY = process.env.RAWG_API_KEY;

const BATCH_SIZE = 10;
const DELAY_MS = 350;

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

function cleanGameName(name) {
  return name
    .replace(/\(.*?\)/g, '')
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
  return data.results[0];
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
  const gameplay = screenshots.filter((s) => s !== cover).slice(0, 3);

  if (gameplay.length < 3) return null;

  return [cover, ...gameplay];
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

    // Only skip if it genuinely already has 4+ real images (not empty arrays)
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

      // Call the RPC function instead of a direct update
      const { data: updatedCount, error: rpcError } = await supabase.rpc(
        'update_game_images',
        {
          product_id: game.id,
          image_urls: images,
        }
      );

      if (rpcError) {
        failed.push({ name: game.name, reason: `RPC failed: ${rpcError.message}` });
      } else if (!updatedCount || updatedCount === 0) {
        failed.push({ name: game.name, reason: 'RPC ran but updated 0 rows (verify RLS/policy)' });
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

  console.log('\n========== FINAL REPORT (VERIFIED) ==========');
  console.log(`✅ Successfully updated (row_count > 0 confirmed): ${succeeded.length}`);
  console.log(`⏭️  Skipped (already had 4+ images): ${skipped.length}`);
  console.log(`❌ Failed/No match/0 rows affected: ${failed.length}`);

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
