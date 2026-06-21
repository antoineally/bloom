const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

const FALLBACK_GIF =
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif";

/* =========================
   💾 CACHE INTELLIGENT
========================= */

// cache par query
const cache = new Map();

// cache TTL (10 minutes)
const TTL = 10 * 60 * 1000;

// anti spam API (global cooldown)
let lastRequestTime = 0;
const MIN_DELAY = 1500; // 1.5s entre requêtes API max

function getCached(query) {
  const entry = cache.get(query);
  if (!entry) return null;

  const isExpired = Date.now() - entry.time > TTL;
  if (isExpired) {
    cache.delete(query);
    return null;
  }

  return entry.gif;
}

function setCache(query, gif) {
  cache.set(query, {
    gif,
    time: Date.now(),
  });
}

/* =========================
   🔎 GIPHY FETCH OPTIMISÉ
========================= */

async function getGifFromGiphy(query) {
  try {
    if (!GIPHY_API_KEY) {
      console.warn("⚠️ Missing GIPHY_API_KEY");
      return FALLBACK_GIF;
    }

    // 1. CACHE HIT → ultra fast (0 API call)
    const cached = getCached(query);
    if (cached) return cached;

    // 2. anti rate-limit (throttle global)
    const now = Date.now();
    if (now - lastRequestTime < MIN_DELAY) {
      return FALLBACK_GIF;
    }
    lastRequestTime = now;

    // 3. API CALL
    const url =
      `https://api.giphy.com/v1/gifs/search` +
      `?api_key=${GIPHY_API_KEY}` +
      `&q=${encodeURIComponent(query)}` +
      `&limit=10` +
      `&rating=pg-13`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Giphy HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!json.data?.length) {
      return FALLBACK_GIF;
    }

    // 4. random pick
    const random =
      json.data[Math.floor(Math.random() * json.data.length)];

    const gif = random.images?.original?.url || FALLBACK_GIF;

    // 5. cache result
    setCache(query, gif);

    return gif;

  } catch (error) {
    console.error("❌ Giphy API error:", error);
    return FALLBACK_GIF;
  }
}

module.exports = { getGifFromGiphy };