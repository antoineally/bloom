const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(member) {

        const channel = member.guild.channels.cache.get(process.env.MOD_CHANNEL_ID);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0xEF4444)
            .setTitle('🚪 Member Left')
            .setDescription(`${member.displayName} has left the server.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        await channel.send({ embeds: [embed] });
    }
};
