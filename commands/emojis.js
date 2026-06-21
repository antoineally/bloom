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
   EMOJI DATABASE
========================= */

const emojiData = {
  "👊": { category: "combat", query: "punch", messages: ["{user} hits {target} 👊"] },
  "🤜": { category: "combat", query: "punch hit", messages: ["{user} strikes {target} 🤜"] },
  "🦶": { category: "combat", query: "kick fight", messages: ["{user} kicks {target} 🦶"] },

  "🔥": { category: "powers", query: "fire blast", messages: ["{user} burns {target} 🔥"] },
  "⚡": { category: "powers", query: "lightning strike", messages: ["{user} shocks {target} ⚡"] },

  "😂": { category: "reactions", query: "laughing reaction", messages: ["{user} laughs at {target} 😂"] },
  "😭": { category: "reactions", query: "crying reaction", messages: ["{user} cries because of {target} 😭"] },

  "🤗": { category: "affection", query: "hug anime", messages: ["{user} hugs {target} 🤗"] },
  "❤️": { category: "affection", query: "love hearts", messages: ["{user} loves {target} ❤️"] },

  "😏": { category: "suggestive", query: "flirty wink", messages: ["{user} flirts with {target} 😏"] },

  "🤡": { category: "troll", query: "clown meme", messages: ["{user} calls {target} a clown 🤡"] },
};


/* =========================
   NORMALIZED MAP
========================= */

const emojiDataNormalized = Object.fromEntries(
  Object.entries(emojiData).map(([emoji, data]) => [normalizeEmoji(emoji), data])
);


/* =========================
   GIF FETCH
========================= */

async function getGif(query) {
  try {
    if (!GIPHY_API_KEY) return FALLBACK_GIF;

    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=10&rating=pg-13`
    );

    const json = await res.json();
    if (!json.data?.length) return FALLBACK_GIF;

    return json.data[Math.floor(Math.random() * json.data.length)].images.original.url;
  } catch {
    return FALLBACK_GIF;
  }
}


/* =========================
   COMMAND BUILDER
========================= */

const buildSub = (name, desc) =>
  (cmd) =>
    cmd
      .setName(name)
      .setDescription(desc)
      .addStringOption(o =>
        o
          .setName("emoji")
          .setDescription("Choose an emoji")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addUserOption(o =>
        o
          .setName("target")
          .setDescription("Target user")
          .setRequired(true)
      );


module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Generate an interaction GIF based on an emoji")

    .addSubcommand(buildSub("combat", "Combat GIF"))
    .addSubcommand(buildSub("powers", "Powers GIF"))
    .addSubcommand(buildSub("reactions", "Reactions GIF"))
    .addSubcommand(buildSub("affection", "Affection GIF"))
    .addSubcommand(buildSub("suggestive", "Suggestive GIF"))
    .addSubcommand(buildSub("troll", "Troll GIF")),

  /* =========================
     AUTOCOMPLETE
  ========================= */

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    const sub = interaction.options.getSubcommand();
    const search = (focused.value || "").toLowerCase();

    const list = Object.keys(emojiData).filter(
      e => emojiData[e].category === sub
    );

    const filtered = list.filter(e =>
      e.includes(search) ||
      emojiData[e].query.toLowerCase().includes(search)
    );

    return interaction.respond(
      filtered.slice(0, 25).map(e => ({
        name: `${e} — ${emojiData[e].query}`,
        value: e,
      }))
    );
  },

  /* =========================
     EXECUTE
  ========================= */

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    const emoji = normalizeEmoji(interaction.options.getString("emoji"));
    const target = interaction.options.getUser("target");

    const data = emojiDataNormalized[emoji];

    if (!data || data.category !== sub) {
      return interaction.reply({
        content: "❌ Invalid emoji for this category",
        ephemeral: true,
      });
    }

    const gif = await getGif(data.query);

    const text = data.messages[0]
      .replace("{user}", interaction.user.toString())
      .replace("{target}", target.toString());

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setDescription(text)
      .setImage(gif)
      .setFooter({ text: "GIF Interaction System ⚡" });

    return interaction.reply({ embeds: [embed] });
  },
};