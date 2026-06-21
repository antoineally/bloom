const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testgreet')
        .setDescription('Test welcome and leave messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Message type')
                .setRequired(true)
                .addChoices(
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Leave', value: 'leave' }
                )
        )

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to simulate')
        ),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const user = interaction.options.getUser('user') || interaction.user;

        let embed;

        if (type === 'welcome') {
            embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('👋 Welcome!')
                .setDescription(
                    `Welcome to **${interaction.guild.name}**, ${user}!\n\nWe're happy to have you here.`
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }))
                .setFooter({
                    text: `Member #${interaction.guild.memberCount}`
                })
                .setTimestamp();
        } else {
            embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('👋 Goodbye!')
                .setDescription(
                    `${user.tag} has left the server.\n\nWe hope to see you again soon.`
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }))
                .setTimestamp();
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
};