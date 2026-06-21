const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        const guild = member.guild;

        const rulesId = process.env.RULES_CHANNEL_ID;
        const rolesId = process.env.ROLES_CHANNEL_ID;
        const birthdayId = process.env.BIRTHDAY_CHANNEL_ID;
        const introId = process.env.INTRO_CHANNEL_ID;
        const welcomeId = process.env.WELCOME_CHANNEL_ID;

        const welcome = await guild.channels.fetch(welcomeId).catch(() => null);
        if (!welcome) return;

        const memberCount = guild.memberCount;

        const embed = new EmbedBuilder()
            .setColor(0x7C3AED)
            .setDescription(
`👋 **Hello ${member.displayName}!**  
Welcome to ${guild.name}!

We're happy to have you here! 🎉 You are the ${memberCount}th member to join.

📌 Please read the ${rulesId ? `<#${rulesId}>` : '❌ missing'}  
🎭 Pick your ${rolesId ? `<#${rolesId}>` : '❌ missing'}  
🎂 Add your ${birthdayId ? `<#${birthdayId}>` : '❌ missing'}  
💬 Join the ${introId ? `<#${introId}>` : '❌ missing'}

Enjoy your stay and have fun! 🤘`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage('https://media.discordapp.net/attachments/1505673316936192010/1515410047511822367/finallogo.gif');

        await welcome.send({ embeds: [embed] });
    }
};
