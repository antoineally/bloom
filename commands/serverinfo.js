const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about this server'),

    async execute(interaction) {

        const guild = interaction.guild;
        const owner = await guild.fetchOwner();

        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        const banner = guild.bannerURL({ size: 512, dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('#9B5DE5')
            .setTitle('Server Information')
            .setDescription(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .setImage(banner || null)

            .addFields(
                {
                    name: '👑 Owner' + '⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ' + '👥 Members',
                    value: owner.displayName + '⠀ ⠀ ⠀ ⠀   ⠀ ' + `\`${guild.memberCount}\``,
                    inline: false
                },

                {
                    name: '📆 Created',
                    value: `${formatDate(guild.createdTimestamp)} | <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: false
                },

                {
                    name: '💬 Channels' + '⠀ ⠀ ⠀ ⠀ ⠀ ⠀    ' + '🔐 Roles',
                    value:
                        `\`${guild.channels.cache.size}\`` +
                        '⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ⠀ ⠀ ⠀' +
                        `\`${guild.roles.cache.size - 1}\``,
                    inline: false
                },

                {
                    name: '🌍 Boost Level' + '⠀ ⠀ ⠀ ⠀ ⠀   ' + '🚀 Boosts',
                    value:
                        `\`${guild.premiumTier}\`` +
                        '⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ⠀   ⠀ ⠀' +
                        `\`${guild.premiumSubscriptionCount || 0}\``,
                    inline: false
                }
            )

            .setFooter({
                text: `Server ID: ${guild.id}`,
                iconURL: guild.iconURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed] });
    }
};