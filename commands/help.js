const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📚 Show all bot commands'),

    async execute(interaction) {
        const space = '\u200B';

        const embed = new EmbedBuilder()
            .setColor(0x00B0FF)
            .setTitle('📚 Help Menu')
            .setDescription(
                `${space}\n`
            )
            .addFields(
                {
                    name: '⚙️ Utilities',
                    value:
                        '• `/serverinfo` — Show server information\n' +
                        '• `/userinfo` — Show detailed user information\n' +
                        '• `/clear` — Delete messages (admins)\n' +
                        `${space}\n` + `${space}\n`
                },
                {
                    name: '🎮 Fun',
                    value:
                        '• `/joke` — Generate a random joke\n' +
                        '• `/nickname` — Set an anonymous funny nickname\n\n' +
                        '• `/gif global` — Generate a random emoji-based GIF\n' +
                        '• `/gif reactions` — Generate GIFs based on reaction emojis 😂 😭 😱 😡 🙄 😴 🤡\n' +
                        '• `/gif affection` — Generate GIFs based on affection emojis 🤗 😘 ❤️ 🌹\n' +
                        '• `/gif social` — Generate GIFs based on social interaction emojis 👋 👏 🙏 🤝 💪 🍀 🏆 🍻 🎂 🎉\n' +
                        '• `/gif suggestive` — Generate GIFs based on suggestive emojis 😏 😉 🫦 🥵 😳 👀 🍆 💦\n' +
                        '• `/gif troll` — Generate GIFs based on troll/chaos emojis 🍅 🥚 🪨 🧻 🍌 👞\n' +
                        '• `/gif combat` — Generate GIFs based on combat emojis 👊 🦶 ⚔️ 🔫\n' +
                        '• `/gif powers` — Generate GIFs based on power emojis 🔥 ⚡ ❄️ 🌪️ 🌊 🪄\n' +
                        `${space}`
                },
                {
                    name: '🎂 Birthdays',
                    value:
                        '• `/birthday set` — Set your birthday\n' +
                        '• `/birthday remove` — Remove your birthday\n' +
                        '• `/birthday check` — Check a birthday\n' +
                        '• `/birthday list` — Show upcoming and recent birthdays'
                }
            );

        return interaction.reply({ embeds: [embed] });
    }
};                        '• `/gif combat` — Generate GIFs based on combat emojis 👊 🦶 ⚔️ 🔫\n' +
                        '• `/gif powers` — Generate GIFs based on power emojis 🔥 ⚡ ❄️ 🌪️ 🌊 🪄\n' +
                        `${space}`
                },
                {
                    name: '🎂 Birthdays',
                    value:
                        '• `/birthday set` — Set your birthday\n' +
                        '• `/birthday remove` — Remove your birthday\n' +
                        '• `/birthday check` — Check a birthday\n' +
                        '• `/birthday list` — Show upcoming and recent birthdays'
                }
            );

        return interaction.reply({ embeds: [embed] });
    }
};
