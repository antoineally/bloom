const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const prefixes = [
  'Expired', 'Crusty', 'Deep-Fried', 'Greasy', 'Damp',
  'Forbidden', 'Suspiciously Damp', 'Unwashed', 'Sticky'
];

const nouns = [
  'Armpit', 'Butt Cheek', 'Lint Ball', 'Toe Bean',
  'Sock Goblin', 'Pocket Crumb', 'Knee Gremlin'
];

const suffixes = [
  'of Questionable Moisture', 'Supreme', 'the Unwashed',
  'from the Couch Crease', 'of Mild Concern'
];

function random(arr) {
  if (!arr.length) {
    throw new Error('Array is empty');
  }

  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNick() {
  const type = Math.random();

  if (type < 0.33) {
    return `${random(prefixes)} ${random(nouns)}`;
  }

  if (type < 0.66) {
    return `${random(nouns)} ${random(suffixes)}`;
  }

  return `${random(prefixes)} ${random(nouns)} ${random(suffixes)}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('📛 Set a cursed nickname')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Target user')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Preferred nickname (optional). Leave blank to generate a random cursed nickname.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);

    let name = interaction.options.getString('name');

    const isMod = interaction.member.permissions.has(
      PermissionFlagsBits.ManageNicknames
    );

    if (!isMod) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true
      });
    }

    if (!member) {
      return interaction.reply({
        content: '❌ User not found.',
        ephemeral: true
      });
    }

    if (!name) {
      name = generateNick();
    }

    if (name.length > 32) {
      name = name.slice(0, 32);
    }

    const oldNick = member.nickname;

    try {
      await member.setNickname(name);

      // Public anonymous message
      await interaction.channel.send({
        content: `📛 ${member} has been given a new nickname`
      });

      // Private confirmation
      await interaction.reply({
        content: '✅ Nickname updated.',
        ephemeral: true
      });

      // Auto reset after 8 hours
      setTimeout(async () => {
        try {
          await member.setNickname(oldNick ?? null);
        } catch (err) {
          console.error('Reset nickname failed:', err);
        }
      }, 8 * 60 * 60 * 1000);

    } catch (err) {
      console.error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          content: '❌ Failed to change nickname.'
        });
      } else {
        await interaction.reply({
          content: '❌ Failed to change nickname.',
          ephemeral: true
        });
      }
    }
  }
};