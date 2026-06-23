const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../utils/nicknameStore');

/* =========================
   RANDOM NICKNAME GENERATOR
========================= */

function generateNick() {
  const adjectives = [
    'Moldy','Wet','Suspicious','Broken','Expired','Greasy','Crusty',
    'Feral','Forgotten','Leaky','Rotting','Stained','Busted',
    'Unwashed','Questionable','Offbrand','Glitched','Bugged'
  ];

  const nouns = [
    'Sock','Chair','Banana','Toilet','Couch','Remote','Keyboard',
    'Spaghetti','Dustpile','Dumpster','Fridge','Microwave',
    'Lawnchair','RubberDuck','Trashbag','WetWipe'
  ];

  const complements = [
    'basement','no wifi','bad decisions','low battery','on trial',
    'lost cause','no refunds','broken dreams','budget edition',
    'expired','unsupported','out of service'
  ];

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const patterns = [
    () => `${random(adjectives)} ${random(nouns)}`,
    () => `${random(nouns)} ${random(complements)}`,
    () => `${random(adjectives)} ${random(nouns)} ${random(complements)}`,
    () => `${random(nouns)}_${random(adjectives)}`
  ];

  let name = random(patterns)();

  // hard enforce Discord limit
  name = name.slice(0, 32);

  // avoid empty edge case
  return name || "Broken Account";
}

/* =========================
   COMMAND
========================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('📛 Assign a funny temporary nickname (8h)')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Target user')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Custom nickname (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const brand = "Bʟᴏᴏᴍ Assɪsᴛᴀɴᴛ 🌸";

    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const botMember = interaction.guild.members.me;

    if (!member) {
      return interaction.reply({
        content: `${brand}\n❌ User not found.`,
        flags: 64
      });
    }

    if (!botMember.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return interaction.reply({
        content: `${brand}\n❌ Missing Manage Nicknames permission.`,
        flags: 64
      });
    }

    if (member.roles.highest.position >= botMember.roles.highest.position) {
      return interaction.reply({
        content: `${brand}\n❌ Role hierarchy prevents nickname change.`,
        flags: 64
      });
    }

    /* =========================
       🧠 FIX: ORIGINAL ONLY ONCE
    ========================= */

    const db = store.load();

    const originalNick =
      db[member.id]?.originalNick ?? member.displayName;

    /* =========================
       NEW NAME
    ========================= */

    let name = interaction.options.getString('name') || generateNick();
    if (name.length > 32) name = name.slice(0, 32);

    try {
      await member.setNickname(name);

      /* save ONLY FIRST original */
      store.set(member.id, {
        guildId: interaction.guild.id,
        originalNick,
        expireAt: Date.now() + 8 * 60 * 60 * 1000
      });

      /* 🌍 PUBLIC MESSAGE */
      await interaction.channel.send({
        content: `📛 ${member} has been given a new nickname`
      });

      /* 🔒 PRIVATE MESSAGE */
      return interaction.reply({
        content: `${brand}\n✅ Nickname updated successfully.`,
        flags: 64
      });

    } catch (err) {
      console.error(err);

      return interaction.reply({
        content: `${brand}\n❌ Failed to update nickname.`,
        flags: 64
      });
    }
  }
};