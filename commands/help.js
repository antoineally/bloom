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
            .setDescription(`${space}\n`)
            .addFields(
                {
                    name: '⚙️ Utilities',
                    value:
                        '• `/serverinfo` — Show server information\n' +
                        '• `/userinfo` — Show detailed user information\n' +
                        '• `/clear` — Delete messages (admins)\n' +
                        `${space}\n${space}\n`
                },
                {
                    name: '🎮 Fun',
                    value:
                        '• `/joke` — Get a random joke\n' +
                        '• `/nickname` — Generate a random nickname\n\n' +

                        '• `/gif combat` — Generate a combat GIF (👊 🤜 🦶 🥊 💥 ⚔️ 🗡️ 🏹 🪓 🔨 🔫)\n' +
                        '• `/gif powers` — Generate a powers GIF (🔥 ⚡ ❄️ 🌪️ 🌊 ☄️ ✨ 💫 🔮 🪄)\n' +
                        '• `/gif reactions` — Generate a reactions GIF (😂 🤣 😭 😱 💀 😡 😈 🤯 🙄 😴)\n' +
                        '• `/gif affection` — Generate an affection GIF (🤗 😘 💋 🥰 ❤️ 💕 🫶 🌹 💌)\n' +
                        '• `/gif suggestive` — Generate a suggestive GIF (😏 😉 🫦 🥵 😳 👀 🍑 🍆 💦)\n' +
                        '• `/gif troll` — Generate a troll GIF (🤡 🍅 🥚 🪨 🧻 🍌 🐟 👞 🦆 🐸 🗿)\n' +
                        `${space}\n${space}\n`
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