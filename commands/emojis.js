const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const EMBED_COLOR = 0x2b2d31;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const FALLBACK_GIF = "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const emojiData = require("../data/emojiData");

/* =========================
   EMOJI NORMALIZATION
========================= */
const normalizeEmoji = (e) =>
  Array.from(String(e).normalize("NFC")).join("");

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

    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=pg-13`
    );
    const json = await res.json();

    if (!json?.data?.length) return FALLBACK_GIF;

    const pick = json.data[Math.floor(Math.random() * json.data.length)];
    return pick?.images?.original?.url || FALLBACK_GIF;
  } catch {
    return FALLBACK_GIF;
  }
}

/* =========================
   COMMAND
========================= */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("🎬 Generate an interaction GIF based on an emoji")

    // GLOBAL
    .addSubcommand(cmd =>
      cmd
        .setName("global")
        .setDescription("Generate a random GIF based on any emoji")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // COMBAT
    .addSubcommand(cmd =>
      cmd
        .setName("combat")
        .setDescription("Generate a random GIF based on a combat emoji 👊 🦶 💥 ⚔️ 🪓 🔫")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // POWERS
    .addSubcommand(cmd =>
      cmd
        .setName("powers")
        .setDescription("Generate a random GIF based on a power emoji 🔥 ⚡ ❄️ 🌪️ 🌊 ✨ 🪄")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // REACTIONS
    .addSubcommand(cmd =>
      cmd
        .setName("reactions")
        .setDescription("Generate a random GIF based on a reaction emoji 😂 😭 😱 😡 🙄 😴 🤡")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // AFFECTION
    .addSubcommand(cmd =>
      cmd
        .setName("affection")
        .setDescription("Generate a random GIF based on an affection emoji 🤗 😘 ❤️ 🌹")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // SUGGESTIVE
    .addSubcommand(cmd =>
      cmd
        .setName("suggestive")
        .setDescription("Generate a random GIF based on a suggestive emoji 😏 😉 🫦 🥵 😳 👀 🍆 💦")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // TROLL
    .addSubcommand(cmd =>
      cmd
        .setName("troll")
        .setDescription("Generate a random GIF based on a troll emoji 🍅 🥚 🪨 🧻 🍌 🐟 👞 🐸")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    )

    // SOCIAL
    .addSubcommand(cmd =>
      cmd
        .setName("social")
        .setDescription("Generate a random GIF based on a social emoji 👋 👏 🙏 🤝 💪 🍀 🏆 🍻 🎂 🎉")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(o =>
          o.setName("user")
            .setDescription("Target user")
            .setRequired(true)
        )
    ),

  /* =========================
       AUTOCOMPLETE
  ========================= */
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    const sub = interaction.options.getSubcommand();
    const search = (focused.value || "").toLowerCase();

    let list = Object.keys(emojiData);

    if (sub !== "global") {
      list = list.filter((e) => emojiData[e].category === sub);
    }

    const filtered = list
      .filter((e) => {
        const data = emojiData[e];
        return (
          e.includes(search) ||
          data.label.toLowerCase().includes(search) ||
          data.query.toLowerCase().includes(search)
        );
      })
      .slice(0, 25);

    await interaction.respond(
      filtered.map((e) => ({
        name: `${e} — ${emojiData[e].label}`,
        value: e,
      }))
    );
  },

  /* =========================
       EXECUTE
  ========================= */
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const emojiRaw = interaction.options.getString("emoji");
    const emoji = normalizeEmoji(emojiRaw);
    const target = interaction.options.getUser("user");

    const data = emojiDataNormalized[emoji];

    if (!data) {
      return interaction.reply({
        content: "❌ Invalid emoji.",
        ephemeral: true,
      });
    }

    if (sub !== "global" && data.category !== sub) {
      return interaction.reply({
        content: "❌ This emoji does not belong to this category.",
        ephemeral: true,
      });
    }

    const gif = await getGif(data.query);
    const message = data.messages[Math.floor(Math.random() * data.messages.length)];

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