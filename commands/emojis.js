const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const EMBED_COLOR = 0x2b2d31;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

const FALLBACK_GIF =
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* =========================
   NORMALISATION EMOJI
========================= */
const normalizeEmoji = (e) =>
  Array.from(String(e).normalize("NFC")).join("");

/* =========================
   EMOJI DATA (INTÉGRÉ)
========================= */
const emojiData = {

  /* ================= COMBAT ================= */
  "👊": { category: "combat", query: "punch", messages: ["{user} hits {target} 👊"] },
  "🤜": { category: "combat", query: "punch hit", messages: ["{user} strikes {target} 🤜"] },
  "🦶": { category: "combat", query: "kick fight", messages: ["{user} kicks {target} 🦶"] },
  "🥊": { category: "combat", query: "boxing punch", messages: ["{user} boxes {target} 🥊"] },
  "💥": { category: "combat", query: "explosion impact", messages: ["💥 {target} is blasted by {user}"] },
  "⚔️": { category: "combat", query: "sword fight", messages: ["{user} challenges {target} ⚔️"] },
  "🗡️": { category: "combat", query: "dagger attack", messages: ["{user} attacks {target} 🗡️"] },
  "🏹": { category: "combat", query: "arrow shot", messages: ["{user} shoots an arrow at {target} 🏹"] },
  "🪓": { category: "combat", query: "axe attack", messages: ["{user} strikes {target} with an axe 🪓"] },
  "🔨": { category: "combat", query: "hammer smash", messages: ["{user} smashes {target} 🔨"] },
  "🔫": { category: "combat", query: "gunshot cinematic action", messages: ["{user} opens fire on {target} 🔫"] },

  /* ================= POWERS ================= */
  "🔥": { category: "powers", query: "fire blast", messages: ["{user} burns {target} 🔥"] },
  "⚡": { category: "powers", query: "lightning strike", messages: ["{user} electrocutes {target} ⚡"] },
  "❄️": { category: "powers", query: "ice attack", messages: ["{user} freezes {target} ❄️"] },
  "🌪️": { category: "powers", query: "tornado power", messages: ["{user} summons a tornado on {target} 🌪️"] },
  "🌊": { category: "powers", query: "water splash", messages: ["{user} splashes {target} 🌊"] },
  "☄️": { category: "powers", query: "meteor strike", messages: ["{user} calls a meteor on {target} ☄️"] },
  "✨": { category: "powers", query: "magic sparkles", messages: ["{user} enchants {target} ✨"] },
  "💫": { category: "powers", query: "magic effect", messages: ["{user} dazzles {target} 💫"] },
  "🔮": { category: "powers", query: "magic spell", messages: ["{user} casts a spell on {target} 🔮"] },
  "🪄": { category: "powers", query: "wizard casting spell", messages: ["{user} uses magic on {target} 🪄"] },

  /* ================= REACTIONS ================= */
  "😂": { category: "reactions", query: "laughing reaction", messages: ["{user} laughs at {target} 😂"] },
  "🤣": { category: "reactions", query: "rolling laugh", messages: ["{user} mocks {target} 🤣"] },
  "😭": { category: "reactions", query: "crying reaction", messages: ["{user} cries because of {target} 😭"] },
  "😱": { category: "reactions", query: "shocked reaction", messages: ["{user} is shocked by {target} 😱"] },
  "💀": { category: "reactions", query: "dead meme", messages: ["{user} destroys {target} 💀"] },
  "😡": { category: "reactions", query: "angry reaction", messages: ["{user} is angry at {target} 😡"] },
  "😈": { category: "reactions", query: "evil laugh", messages: ["{user} taunts {target} 😈"] },
  "🤯": { category: "reactions", query: "mind blown", messages: ["{user} blows {target}'s mind 🤯"] },
  "🙄": { category: "reactions", query: "eye roll reaction", messages: ["{user} ignores {target} 🙄"] },
  "😴": { category: "reactions", query: "sleeping reaction", messages: ["{user} puts {target} to sleep 😴"] },

  /* ================= AFFECTION ================= */
  "🤗": { category: "affection", query: "anime hug", messages: ["{user} hugs {target} 🤗"] },
  "😘": { category: "affection", query: "anime kiss", messages: ["{user} kisses {target} 😘"] },
  "💋": { category: "affection", query: "blowing kiss", messages: ["{user} sends a kiss to {target} 💋"] },
  "🥰": { category: "affection", query: "cute love anime", messages: ["{user} adores {target} 🥰"] },
  "❤️": { category: "affection", query: "romantic hearts", messages: ["{user} loves {target} ❤️"] },
  "💕": { category: "affection", query: "heart shower", messages: ["{user} showers {target} with love 💕"] },
  "🫶": { category: "affection", query: "heart hands", messages: ["{user} shows affection to {target} 🫶"] },
  "🌹": { category: "affection", query: "giving rose", messages: ["{user} gives a rose to {target} 🌹"] },
  "💌": { category: "affection", query: "love letter", messages: ["{user} sends a love letter to {target} 💌"] },

  /* ================= SUGGESTIVE ================= */
  "😏": { category: "suggestive", query: "flirty wink", messages: ["{user} flirts with {target} 😏"] },
  "😉": { category: "suggestive", query: "wink flirt", messages: ["{user} winks at {target} 😉"] },
  "🫦": { category: "suggestive", query: "seductive look", messages: ["{user} teases {target} 🫦"] },
  "🥵": { category: "suggestive", query: "hot reaction", messages: ["{user} makes {target} blush 🥵"] },
  "😳": { category: "suggestive", query: "blushing anime", messages: ["{user} embarrasses {target} 😳"] },
  "👀": { category: "suggestive", query: "flirty stare", messages: ["{user} looks at {target} 👀"] },
  "🍑": { category: "suggestive", query: "peach suggestive", messages: ["{user} teases {target} 🍑"] },
  "🍆": { category: "suggestive", query: "eggplant suggestive", messages: ["{user} teases {target} 🍆"] },
  "💦": { category: "suggestive", query: "water splash reaction", messages: ["{user} splashes {target} 💦"] },

  /* ================= TROLL ================= */
  "🤡": { category: "troll", query: "clown reaction", messages: ["{user} calls {target} a clown 🤡"] },
  "🍅": { category: "troll", query: "throw tomatoes", messages: ["{user} throws a tomato at {target} 🍅"] },
  "🥚": { category: "troll", query: "egg throw", messages: ["{user} throws an egg at {target} 🥚"] },
  "🪨": { category: "troll", query: "rock throw", messages: ["{user} throws a rock at {target} 🪨"] },
  "🧻": { category: "troll", query: "toilet paper prank", messages: ["{user} wraps {target} in toilet paper 🧻"] },
  "🍌": { category: "troll", query: "banana slip", messages: ["{user} makes {target} slip 🍌"] },
  "🐟": { category: "troll", query: "fish slap", messages: ["{user} slaps {target} with a fish 🐟"] },
  "👞": { category: "troll", query: "shoe throw", messages: ["{user} throws a shoe at {target} 👞"] },
  "🦆": { category: "troll", query: "duck attack", messages: ["{user} sends a duck at {target} 🦆"] },
  "🐸": { category: "troll", query: "pepe meme", messages: ["{user} trolls {target} 🐸"] },
  "🗿": { category: "troll", query: "gigachad meme", messages: ["{user} crushes {target} 🗿"] },
};

/* =========================
   NORMALIZED MAP
========================= */
const emojiDataNormalized = Object.fromEntries(
  Object.entries(emojiData).map(([emoji, data]) => [
    normalizeEmoji(emoji),
    data,
  ])
);

/* =========================
   GIF FETCH
========================= */
async function getGif(query) {
  try {
    if (!GIPHY_API_KEY) return FALLBACK_GIF;

    const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=pg-13`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json?.data?.length) return FALLBACK_GIF;

    const pick = json.data[Math.floor(Math.random() * json.data.length)];
    return pick?.images?.original?.url || FALLBACK_GIF;
  } catch {
    return FALLBACK_GIF;
  }
}

/* =========================
   SUB BUILDER
========================= */
const buildSub = (name, desc) => (cmd) =>
  cmd
    .setName(name)
    .setDescription(desc)
    .addStringOption(o =>
      o.setName("emoji")
        .setDescription("Choose an emoji")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addUserOption(o =>
      o.setName("target")
        .setDescription("Target user")
        .setRequired(true)
    );

/* =========================
   COMMAND
========================= */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Generate an interaction GIF based on an emoji")

    .addSubcommand(buildSub("combat", "Generate a random fighting GIF 👊 targeting a user"))
.addSubcommand(buildSub("powers", "Generate a random power GIF 💥 targeting a user"))
.addSubcommand(buildSub("reactions", "Generate a random reaction GIF 😂 targeting a user"))
.addSubcommand(buildSub("affection", "Generate a random affectionate GIF ❤️ targeting a user"))
.addSubcommand(buildSub("suggestive", "Generate a random suggestive GIF 🔥 targeting a user"))
.addSubcommand(buildSub("troll", "Generate a random troll GIF 😏 targeting a user")),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    const sub = interaction.options.getSubcommand();
    const search = (focused.value || "").toLowerCase();

    const list = Object.keys(emojiData).filter(
      e => emojiData[e].category === sub
    );

    const filtered = list.filter(
      e =>
        e.includes(search) ||
        emojiData[e].query.toLowerCase().includes(search)
    );

    return interaction.respond(
      filtered.slice(0, 25).map(e => ({
        name: e,
        value: e,
      }))
    );
  },

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const emoji = normalizeEmoji(interaction.options.getString("emoji"));
    const target = interaction.options.getUser("target");

    const data = emojiDataNormalized[emoji];

    if (!data || data.category !== sub) {
      return interaction.reply({
        content: "❌ Invalid emoji for this category.",
        ephemeral: true,
      });
    }

    const gif = await getGif(data.query);

    const message =
      data.messages[Math.floor(Math.random() * data.messages.length)];

    const text = message
      .replaceAll("{user}", interaction.user.toString())
      .replaceAll("{target}", target.toString());

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setDescription(text)
      .setImage(gif)
      .setFooter({ text: "GIF Interaction System ⚡" });

    return interaction.reply({ embeds: [embed] });
  },
};
