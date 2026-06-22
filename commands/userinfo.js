const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to display')
                .setRequired(false)
        ),

    async execute(interaction) {

        const guild = interaction.guild;

        const member = interaction.options.getMember('user') || interaction.member;
        const user = member.user;

        const embedColor =
            member.displayHexColor === '#000000'
                ? '#9B5DE5'
                : member.displayHexColor;

        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleDateString('en-EN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('🌸 User Information 🌸')
            .setDescription(`${member}`)
            .setImage(user.displayAvatarURL({ size: 512, dynamic: true }))

            .addFields(
                // ligne 1
                {
                    name: '👤 Discord Tag' + '⠀⠀⠀⠀⠀' + '🚀 Boost',
                    value:
                        user.tag +
                        (member.premiumSince ? 'Yes' : 'No'),
                    inline: false
                },

                {
                    name: '📆 Created',
                    value: `${formatDate(user.createdTimestamp)} | <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
                    inline: false
                },

                {
                    name: '🫂 Joined',
                    value: `${formatDate(member.joinedTimestamp)} | <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
                    inline: false
                },

                // ligne 3
                {
                    name: '🎭 Roles',
                    value: member.roles.cache
                        .filter(role => role.id !== guild.id)
                        .sort((a, b) => b.position - a.position)
                        .map(role => role.toString())
                        .join(' ') || 'None',
                    inline: false
                }
            )

            .setFooter({
                text: `🆔 ${member.id}`,
            });

        await interaction.reply({ embeds: [embed] });
    }
};