const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

const FALLBACKS = [
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  "https://media.giphy.com/media/l0HU20BZ6LbSEITza/giphy.gif",
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
];

const cache = new Map();
const TTL = 10 * 60 * 1000;

const lastGifByQuery = new Map();

/* =========================
   FALLBACK
========================= */

function getFallback() {
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

/* =========================
   CACHE
========================= */

function getCached(query) {
  const entry = cache.get(query);
  if (!entry) return null;

  if (Date.now() - entry.time > TTL) {
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
   PICK GIF
========================= */

function pickGif(data, query) {
  const last = lastGifByQuery.get(query);

  const pool =
    data.length > 1
      ? data.filter(g => g?.images?.original?.url !== last)
      : data;

  const list = pool.length ? pool : data;

  const pick = list[Math.floor(Math.random() * list.length)];
  const gif = pick?.images?.original?.url;

  lastGifByQuery.set(query, gif);

  return gif;
}

/* =========================
   MAIN
========================= */

async function getGifFromGiphy(query) {
  try {
    if (!GIPHY_API_KEY) {
      console.log("❌ Missing API key");
      return getFallback();
    }

    if (!query || typeof query !== "string") {
      console.log("❌ Invalid query:", query);
      return getFallback();
    }

    // cache
    const cached = getCached(query);
    if (cached) return cached;

    const url = new URL("https://api.giphy.com/v1/gifs/search");
    url.searchParams.set("api_key", GIPHY_API_KEY);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "25");
    url.searchParams.set("rating", "g");

    const res = await fetch(url);

    // 🔥 DEBUG IMPORTANT
    console.log("STATUS:", res.status);

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.log("❌ JSON parse error");
      return getFallback();
    }

    console.log("DATA LENGTH:", json?.data?.length);

    // API error detection
    if (!res.ok) {
      console.log("❌ HTTP ERROR:", res.status);
      return getFallback();
    }

    if (!Array.isArray(json?.data) || json.data.length === 0) {
      console.log("❌ EMPTY DATA");
      return getFallback();
    }

    const gif = pickGif(json.data, query);

    if (!gif) {
      console.log("❌ NO GIF FOUND");
      return getFallback();
    }

    setCache(query, gif);

    return gif;

  } catch (err) {
    console.log("❌ Giphy crash:", err);
    return getFallback();
  }
}

module.exports = { getGifFromGiphy };