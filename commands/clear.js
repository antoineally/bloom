const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages (optionally from a user)')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User whose messages will be deleted (optional)')
                .setRequired(false)
        ),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: "❌ You don't have permission to manage messages.",
                flags: 64
            });
        }

        const amount = interaction.options.getInteger('amount');
        const targetUser = interaction.options.getUser('user');

        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        let filtered = messages;

        // si user ciblé
        if (targetUser) {
            filtered = messages.filter(m => m.author.id === targetUser.id);
        }

        const toDelete = filtered.first(amount);

        if (!toDelete || toDelete.length === 0) {
            return interaction.reply({
                content: "❌ No messages found to delete.",
                flags: 64
            });
        }

        await interaction.channel.bulkDelete(toDelete, true);

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
                targetUser
                    ? `✅ Deleted **${toDelete.length}** messages from **${targetUser.tag}**.`
                    : `✅ Deleted **${toDelete.length}** messages.`
            );

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
    }
};
        if (targetUser) {
            filtered = messages.filter(m => m.author.id === targetUser.id);
        }

        const toDelete = filtered.first(amount);

        if (!toDelete || toDelete.length === 0) {
            return interaction.reply({
                content: "❌ No messages found to delete.",
                flags: 64
            });
        }

        await interaction.channel.bulkDelete(toDelete, true);

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
                targetUser
                    ? `✅ Deleted **${toDelete.length}** messages from **${targetUser.tag}**.`
                    : `✅ Deleted **${toDelete.length}** messages.`
            );

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
    }
};
