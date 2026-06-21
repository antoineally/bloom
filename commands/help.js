const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all bot commands'),

    async execute(interaction) {

        const space = '\u200B';

        const embed = new EmbedBuilder()
            .setColor(0x00B0FF)
            .setTitle('📚 Help Menu')
            .setDescription(
                'Here is the list of available commands:' +
                `\n${space}\n`
            )
            .addFields(
                {
                    name: '⚙️ Utilities',
                    value:
                        '• /serverinfo — Displays information about the server.\n' +
                        '• /userinfo — Displays information about a user.\n' +
                        '• /clear (Admin only) — Deletes recent messages.\n' +
                        `\n${space}\n`
                },
                {
                    name: '🎮 Fun',
                    value:
                        '• /joke — Random joke.\n' +
                        '• /use — Emoji + GIF.\n' +
                        '• /nickname — Generates nickname.\n' +
                        `\n${space}\n`
                },
                {
                    name: '🎂 Birthdays',
                    value:
                        '• /birthday set\n' +
                        '• /birthday remove\n' +
                        '• /birthday check\n' +
                        '• /birthday list'
                }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
