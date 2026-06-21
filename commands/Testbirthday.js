const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testbirthday')
        .setDescription('Test the birthday message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to celebrate')
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const birthdayGifs = [
            'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2NlMGFkNDJ2a2Frb21oNmZreWRwYmgzMnFqMWs3NHZvbzR2NmppeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yoJC2GnSClbPOkV0eA/giphy.gif',
            'https://media.tenor.com/wCo1AiSrB10AAAAm/pengu-pudgy.webp',
            'https://media.tenor.com/hRgp9Dh1ppQAAAP1/happy-birthday.mp4'
        ];

        const birthdayMessages = [
            member => `🎂 Today we celebrate ${member}!\n\nHave an amazing day 🎁`,
            member => `🥳 Everyone, join us in wishing ${member} a fantastic birthday!`,
            member => `🎁 Happy Birthday, ${member}!\n\nMay this new year bring you happiness and success.`
        ];

        const randomGif =
            birthdayGifs[Math.floor(Math.random() * birthdayGifs.length)];

        const randomMessage =
            birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];

        const embed = new EmbedBuilder()
            .setColor(0x7C3AED)
            .setTitle('🎉 Happy Birthday!')
            .setDescription(randomMessage(user))
            .setThumbnail(user.displayAvatarURL({ forceStatic: false }))
            .setImage(randomGif)
            .setFooter({ text: 'Birthday System 🎂' })
            .setTimestamp();

        await interaction.reply({
            content: '@everyone 🎉',
            allowedMentions: {
                parse: ['everyone', 'users']
            },
            embeds: [embed]
        });
    }
};

