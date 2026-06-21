const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

/* =========================
   🎨 CONFIG
========================= */

const EMBED_COLOR = 0x2b2d31;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

const FALLBACK_GIF =
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif";

/* =========================
   🌐 FETCH FIX (IMPORTANT)
========================= */

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* =========================
   🔎 EMOJI DATABASE
========================= */

const emojiData = {
  "👊": { category: "combat", query: "punch", messages: ["{user} punches {target} 👊"] },
  "🤜": { category: "combat", query: "punch hit", messages: ["{user} hits {target} 🤜"] },
  "🦶": { category: "combat", query: "hard kick", messages: ["{user} kicks {target} 🦶"] },
  "🥊": { category: "combat", query: "boxing punch", messages: ["{user} boxes {target} 🥊"] },
  "💥": { category: "combat", query: "explosion impact", messages: ["💥 {target} gets blasted by {user}"] },
  "⚔️": { category: "combat", query: "sword fight", messages: ["{user} challenges {target} ⚔️"] },
  "🗡️": { category: "combat", query: "dagger attack", messages: ["{user} stabs {target} 🗡️"] },
  "🏹": { category: "combat", query: "arrow shot", messages: ["{user} shoots an arrow at {target} 🏹"] },
  "🪓": { category: "combat", query: "axe attack", messages: ["{user} strikes {target} with an axe 🪓"] },
  "🔨": { category: "combat", query: "hammer smash", messages: ["{user} smashes {target} 🔨"] },

  "🔥": { category: "powers", query: "fire blast", messages: ["{user} burns {target} 🔥"] },
  "⚡": { category: "powers", query: "lightning strike", messages: ["{user} zaps {target} ⚡"] },
  "❄️": { category: "powers", query: "ice attack", messages: ["{user} freezes {target} ❄️"] },
  "🌪️": { category: "powers", query: "tornado power", messages: ["{user} summons a tornado on {target} 🌪️"] },
  "🌊": { category: "powers", query: "water splash", messages: ["{user} splashes {target} 🌊"] },
  "☄️": { category: "powers", query: "meteor strike", messages: ["{user} calls a meteor on {target} ☄️"] },
  "✨": { category: "powers", query: "magic sparkles", messages: ["{user} enchants {target} ✨"] },
  "💫": { category: "powers", query: "magic effect", messages: ["{user} dazzles {target} 💫"] },
  "🔮": { category: "powers", query: "magic spell", messages: ["{user} casts a spell on {target} 🔮"] },
  "🪄": { category: "powers", query: "wizard casting spell", messages: ["{user} casts magic on {target} 🪄"] },

  "😂": { category: "reactions", query: "laughing reaction", messages: ["{user} laughs at {target} 😂"] },
  "🤣": { category: "reactions", query: "rolling laugh", messages: ["{user} mocks {target} 🤣"] },
  "😭": { category: "reactions", query: "crying reaction", messages: ["{user} cries over {target} 😭"] },
  "😱": { category: "reactions", query: "shocked reaction", messages: ["{user} scares {target} 😱"] },
  "💀": { category: "reactions", query: "dead meme", messages: ["{user} destroys {target} 💀"] },
  "🤡": { category: "reactions", query: "clown reaction", messages: ["{user} calls {target} a clown 🤡"] },
  "😡": { category: "reactions", query: "angry reaction", messages: ["{user} is angry at {target} 😡"] },
  "😈": { category: "reactions", query: "evil laugh", messages: ["{user} tempts {target} 😈"] },
  "🤯": { category: "reactions", query: "mind blown", messages: ["{user} blows {target}'s mind 🤯"] },
  "🙄": { category: "reactions", query: "eye roll reaction", messages: ["{user} ignores {target} 🙄"] },
  "😴": { category: "reactions", query: "sleeping reaction", messages: ["{user} gets bored by {target} 😴"] },

  "🤗": { category: "affection", query: "anime hug", messages: ["{user} hugs {target} 🤗"] },
  "😘": { category: "affection", query: "anime kiss", messages: ["{user} kisses {target} 😘"] },
  "💋": { category: "affection", query: "blowing kiss", messages: ["{user} blows a kiss to {target} 💋"] },
  "🥰": { category: "affection", query: "cute love anime", messages: ["{user} adores {target} 🥰"] },
  "❤️": { category: "affection", query: "romantic hearts", messages: ["{user} loves {target} ❤️"] },
  "💕": { category: "affection", query: "heart shower", messages: ["{user} showers {target} with love 💕"] },
  "🫶": { category: "affection", query: "heart hands", messages: ["{user} shows affection to {target} 🫶"] },
  "🌹": { category: "affection", query: "giving rose", messages: ["{user} gives a rose to {target} 🌹"] },
  "💌": { category: "affection", query: "love letter", messages: ["{user} sends a love letter to {target} 💌"] },

  "😏": { category: "suggestive", query: "flirty wink", messages: ["{user} flirts with {target} 😏"] },
  "😉": { category: "suggestive", query: "wink flirt", messages: ["{user} winks at {target} 😉"] },
  "🫦": { category: "suggestive", query: "seductive look", messages: ["{user} seduces {target} 🫦"] },
  "🥵": { category: "suggestive", query: "hot reaction", messages: ["{user} makes {target} blush 🥵"] },
  "😳": { category: "suggestive", query: "blushing anime", messages: ["{user} embarrasses {target} 😳"] },
  "👀": { category: "suggestive", query: "flirty stare", messages: ["{user} checks out {target} 👀"] },
  "🍑": { category: "suggestive", query: "peach suggestive", messages: ["{user} teases {target} 🍑"] },
  "🍆": { category: "suggestive", query: "eggplant suggestive", messages: ["{user} teases {target} 🍆"] },
  "💦": { category: "suggestive", query: "water splash reaction", messages: ["{user} splashes {target} 💦"] },

  "🍅": { category: "troll", query: "throw tomatoes at someone", messages: ["{user} throws a tomato at {target} 🍅"] },
  "🥚": { category: "troll", query: "egg throw at someone", messages: ["{user} throws an egg at {target} 🥚"] },
  "🪨": { category: "troll", query: "rock throw at someone", messages: ["{user} throws a rock at {target} 🪨"] },
  "🧻": { category: "troll", query: "toilet paper prank", messages: ["{user} covers {target} with toilet paper 🧻"] },
  "🍌": { category: "troll", query: "banana slip", messages: ["{user} makes {target} slip 🍌"] },
  "🐟": { category: "troll", query: "fish slap", messages: ["{user} slaps {target} with a fish 🐟"] },
  "👞": { category: "troll", query: "shoe throw", messages: ["{user} throws a shoe at {target} 👞"] },
  "🦆": { category: "troll", query: "duck attack", messages: ["{user} unleashes a duck on {target} 🦆"] },
  "🐸": { category: "troll", query: "pepe meme", messages: ["{user} memes {target} 🐸"] },
  "🗿": { category: "troll", query: "gigachad meme", messages: ["{user} gigachads {target} 🗿"] },
};

/* =========================
   📦 HELPERS
========================= */

const allowedEmojis = Object.keys(emojiData);

const gifCache = new Map();

async function getGifFromGiphy(query) {
  try {
    if (!GIPHY_API_KEY) return FALLBACK_GIF;

    if (gifCache.has(query)) return gifCache.get(query);

    const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=10&rating=pg-13`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json.data?.length) return FALLBACK_GIF;

    const gif = json.data[Math.floor(Math.random() * json.data.length)].images.original.url;

    gifCache.set(query, gif);
    return gif;

  } catch (err) {
    console.error("GIPHY ERROR:", err);
    return FALLBACK_GIF;
  }
}

/* =========================
   🧠 CATEGORY HELP TEXT (IMPORTANT FIX)
========================= */

function getItemDescription(category) {
  switch (category) {
    case "combat":
      return "Choose a combat emoji: 👊 🤜 🦶 🥊 💥 ⚔️ 🗡️ 🏹 🪓 🔨";
    case "powers":
      return "Choose a power emoji: 🔥 ⚡ ❄️ 🌪️ 🌊 ☄️ ✨ 💫 🔮 🪄";
    case "reactions":
      return "Choose a reaction emoji: 😂 🤣 😭 😱 💀 🤡 😡 😈 🤯 🙄 😴";
    case "affection":
      return "Choose an affection emoji: 🤗 😘 💋 🥰 ❤️ 💕 🫶 🌹 💌";
    case "suggestive":
      return "Choose a suggestive emoji: 😏 😉 🫦 🥵 😳 👀 🍑 🍆 💦";
    case "troll":
      return "Choose a troll emoji: 🍅 🥚 🪨 🧻 🍌 🐟 👞 🦆 🐸 🗿";
    default:
      return "Choose an emoji";
  }
}

/* =========================
   🚀 COMMAND
========================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("use")
    .setDescription("Use an emoji on a user")

    .addStringOption(option =>
      option
        .setName("category")
        .setDescription("Choose category first")
        .setRequired(true)
        .addChoices(
          { name: "👊 Combat", value: "combat" },
          { name: "✨ Powers", value: "powers" },
          { name: "😂 Reactions", value: "reactions" },
          { name: "❤️ Affection", value: "affection" },
          { name: "😏 Suggestive", value: "suggestive" },
          { name: "🤪 Troll", value: "troll" },
        )
    )

    .addStringOption(option =>
      option
        .setName("item")
        .setDescription("Select an emoji")
        .setAutocomplete(true)
        .setRequired(true)
    )

    .addUserOption(option =>
      option.setName("target").setDescription("Target user").setRequired(true)
    ),

  /* =========================
     🔎 AUTOCOMPLETE FIXED
  ========================= */

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const category = interaction.options.getString("category");

    let choices = allowedEmojis;

    if (category) {
      choices = choices.filter(e => emojiData[e].category === category);
    }

    const filtered = choices
      .filter(e =>
        e.includes(focused) ||
        emojiData[e].query.toLowerCase().includes(focused.toLowerCase())
      )
      .slice(0, 25);

    await interaction.respond(
      filtered.map(e => ({
        name: e,
        value: e,
      }))
    );
  },

  /* =========================
     ⚡ EXECUTE (WITH GIF FIX)
  ========================= */

  async execute(interaction) {
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");
    const target = interaction.options.getUser("target");

    if (!emojiData[item]) {
      return interaction.reply({ content: "❌ Invalid emoji", ephemeral: true });
    }

    const action = emojiData[item];

    const gif = await getGifFromGiphy(action.query);

    const text = action.messages[0]
      .replace("{user}", interaction.user.toString())
      .replace("{target}", target.toString());

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setDescription(text)
      .setImage(gif)
      .setFooter({ text: "Emoji Interaction System ⚡" });

    await interaction.reply({ embeds: [embed] });
     }
};