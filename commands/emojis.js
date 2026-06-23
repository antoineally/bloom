const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const EMBED_COLOR = 0x2b2d31;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

const FALLBACK_GIF =
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const emojiData = require("../data/emojiData");

/* =========================
   GIF FETCH
========================= */

async function getGif(query) {
  try {
    if (!GIPHY_API_KEY) return FALLBACK_GIF;

    const offset = Math.floor(Math.random() * 50);

    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=25&offset=${offset}&rating=pg-13`
    );

    const json = await res.json();
    if (!json.data?.length) return FALLBACK_GIF;

    const gifs = json.data;

    return gifs[Math.floor(Math.random() * gifs.length)].images.original.url;

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
    .setDescription("🎬 Generate a random GIF based on an emoji")

    // GLOBAL MODE
    .addSubcommand(cmd =>
      cmd
        .setName("global")
        .setDescription("Generate a GIF based on any emoji")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // COMBAT
    .addSubcommand(cmd =>
      cmd
        .setName("combat")
        .setDescription("Generate a combat GIF (👊 🦶 ⚔️ 🔫)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // POWERS
    .addSubcommand(cmd =>
      cmd
        .setName("powers")
        .setDescription("Generate a power GIF (🔥 ⚡ ❄️ 🌪️ 🌊 🪄)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // REACTIONS
    .addSubcommand(cmd =>
      cmd
        .setName("reactions")
        .setDescription("Generate a reaction GIF (😂 😭 😱 😡 🙄 😴 🤡)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // AFFECTION
    .addSubcommand(cmd =>
      cmd
        .setName("affection")
        .setDescription("Generate an affectionate GIF (🤗 😘 ❤️ 🌹)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // SUGGESTIVE
    .addSubcommand(cmd =>
      cmd
        .setName("suggestive")
        .setDescription("Generate a suggestive GIF (😏 😉 🫦 🥵 😳 👀 🍆 💦)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // TROLL
    .addSubcommand(cmd =>
      cmd
        .setName("troll")
        .setDescription("Generate a troll GIF (🍅 🥚 🪨 🧻 🍌 👞)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    )

    // SOCIAL
    .addSubcommand(cmd =>
      cmd
        .setName("social")
        .setDescription("Generate a social GIF (👋 👏 🙏 🤝 💪 🍀 🏆 🍻 🎂 🎉)")
        .addStringOption(o =>
          o.setName("emoji")
            .setDescription("Choose an emoji")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(o =>
          o.setName("users")
            .setDescription("Mention up to 5 users (@user @user @user)")
            .setRequired(true)
        )
    ),

  /* =========================
     AUTOCOMPLETE
  ========================= */

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    const sub = interaction.options.getSubcommand();

    let list = Object.keys(emojiData);

    if (sub !== "global") {
      list = list.filter(e => emojiData[e].category === sub);
    }

    const search = (focused.value || "").toLowerCase();

    const filtered = list
      .filter(e =>
        e.includes(search) ||
        emojiData[e].label.toLowerCase().includes(search)
      )
      .slice(0, 25);

    await interaction.respond(
      filtered.map(e => ({
        name: `${e} — ${emojiData[e].label}`,
        value: e
      }))
    );
  },

  /* =========================
     EXECUTE
  ========================= */

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const emoji = interaction.options.getString("emoji");
    const usersInput = interaction.options.getString("users");

    const data = emojiData[emoji];

    if (!data) {
      return interaction.reply({
        content: "❌ Invalid emoji",
        flags: 64,
      });
    }

    if (sub !== "global" && data.category !== sub) {
      return interaction.reply({
        content: "❌ This emoji is not valid for this category",
        flags: 64,
      });
    }

    const targets = usersInput.match(/<@!?(\d+)>/g) || [];

    if (targets.length === 0) {
      return interaction.reply({
        content: "❌ You must mention at least 1 user",
        flags: 64,
      });
    }

    if (targets.length > 5) {
      return interaction.reply({
        content: "❌ Maximum 5 users allowed",
        flags: 64,
      });
    }

    const gif = await getGif(data.query);

    const member = await interaction.guild?.members
      .fetch(interaction.user.id)
      .catch(() => null);

    const userName =
      member?.displayName ??
      interaction.user.globalName ??
      interaction.user.username;

    const text = data.messages[0]
      .replace("{user}", userName)
      .replace("{target}", targets.join(", "));

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setImage(gif)
      .setFooter({ text: "GIF interactions ⚡" });

    return interaction.reply({
      content: text,
      embeds: [embed],
    });
  }
};