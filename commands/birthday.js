const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

const {
    load,
    setBirthday,
    removeBirthday,
    getBirthday
} = require('../utils/birthdays');

// 🎲 Random GIF
async function getBirthdayGif() {
    const gifs = [
        'https://media.tenor.com/QtzWzR4RphAAAAAC/blues-brothers.gif',
        'https://media.tenor.com/KHS0iDoJb0QAAAAd/squid-game-squidgame.gif',
        'https://media.tenor.com/fFCZieAsZ0kAAAAC/spongebob-patrick.gif',
        'https://media.tenor.com/X15e67QrANUAAAAC/the-office.gif',
        'https://media.tenor.com/F355L9Gs16oAAAAm/pengu-pudgy.webp',
        'https://media.tenor.com/AQ9qE0RCCQ4AAAAC/band-marching.gif',
        'https://media.tenor.com/-kx4msGXmN8AAAP1/happy-dance.mp4'
    ];

    return gifs[Math.floor(Math.random() * gifs.length)];
}

// MM-DD → "January 05"
function formatDate(mmdd) {
    const [m, d] = mmdd.split('-').map(Number);
    const date = new Date(2000, m - 1, d);

    return date.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit'
    });
}

function isValidDate(mmdd) {
    const [m, d] = mmdd.split('-').map(Number);
    const date = new Date(2000, m - 1, d);

    return date.getMonth() === m - 1 && date.getDate() === d;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('🎂 Birthday system')

        .addSubcommand(s =>
            s.setName('set')
                .setDescription('Set a birthday (MM-DD)')
                .addStringOption(o =>
                    o.setName('date')
                        .setDescription('MM-DD')
                        .setRequired(true)
                )
                .addUserOption(o =>
                    o.setName('user')
                        .setDescription('Admin only')
                )
        )

        .addSubcommand(s =>
            s.setName('list')
                .setDescription('List birthdays')
        )

        .addSubcommand(s =>
            s.setName('remove')
                .setDescription('Remove a birthday')
                .addUserOption(o =>
                    o.setName('user')
                        .setDescription('Admin only')
                )
        )

        .addSubcommand(s =>
            s.setName('check')
                .setDescription('Check birthday')
                .addUserOption(o =>
                    o.setName('user')
                        .setDescription('User')
                )
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const sub = interaction.options.getSubcommand();

        // =====================
        // SET
        // =====================
        if (sub === 'set') {
            let date = interaction.options.getString('date');
            const targetUser = interaction.options.getUser('user');

            date = date.replace(/[–—−]/g, '-');

            if (!/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
                return interaction.editReply('❌ Invalid format (MM-DD)');
            }

            if (!isValidDate(date)) {
                return interaction.editReply('❌ Invalid date');
            }

            const isSelf = !targetUser || targetUser.id === interaction.user.id;
            const isAdmin = interaction.member.permissions.has(
                PermissionFlagsBits.ManageGuild
            );

            if (!isSelf && !isAdmin) {
                return interaction.editReply('❌ Missing permission');
            }

            const user = targetUser || interaction.user;

            setBirthday(user.id, date);

            return interaction.editReply(
                `🎉 Birthday saved for **${user}** → **${formatDate(date)}**`
            );
        }

        // =====================
        // LIST
        // =====================
        if (sub === 'list') {
            const data = load();
            const entries = Object.entries(data);

            if (!entries.length) {
                return interaction.editReply('❌ No birthdays found');
            }

            const now = new Date();
            const year = now.getFullYear();

            const sorted = entries
                .map(([id, date]) => {
                    const [m, d] = date.split('-').map(Number);

                    let next = new Date(year, m - 1, d);

                    if (next < now) {
                        next = new Date(year + 1, m - 1, d);
                    }

                    const diff = (next - now) / 86400000;

                    return { id, date, diff };
                })
                .filter(x => x.diff >= -7 && x.diff <= 90)
                .sort((a, b) => a.diff - b.diff);

            if (!sorted.length) {
                return interaction.editReply('❌ No birthdays in range');
            }

            const list = await Promise.all(
                sorted.map(async x => {
                    const member = await interaction.guild.members
                        .fetch(x.id)
                        .catch(() => null);

                    const name = member
                        ? member.toString()
                        : `Unknown User (${x.id})`;

                    return `🎂 ${name} → **${formatDate(x.date)}** (in ${Math.ceil(x.diff)} days)`;
                })
            );

            const embed = new EmbedBuilder()
                .setColor(0x7C3AED)
                .setTitle('🎉 Birthday Calendar')
                .setDescription(
                    `**📅 Upcoming & recent birthdays**\n\n${list.join('\n')}`
                )
                .setFooter({
                    text: '✨ Use /birthday set to register yours'
                })
                .setImage(await getBirthdayGif());

            return interaction.editReply({
                embeds: [embed]
            });
        }

        // =====================
        // REMOVE
        // =====================
        if (sub === 'remove') {
            const targetUser = interaction.options.getUser('user');
            const isAdmin = interaction.member.permissions.has(
                PermissionFlagsBits.ManageGuild
            );

            const user = targetUser || interaction.user;

            if (targetUser && targetUser.id !== interaction.user.id && !isAdmin) {
                return interaction.editReply('❌ Missing permission');
            }

            const birthday = getBirthday(user.id);

            if (!birthday) {
                return interaction.editReply('❌ No birthday found');
            }

            removeBirthday(user.id);

            return interaction.editReply(
                `🗑️ Birthday removed for **${user}**`
            );
        }

        // =====================
        // CHECK
        // =====================
        if (sub === 'check') {
            const user = interaction.options.getUser('user') || interaction.user;

            const birthday = getBirthday(user.id);

            return interaction.editReply(
                birthday
                    ? `🎂 ${user} → **${formatDate(birthday.date)}**`
                    : '❌ No birthday found'
            );
        }
    }
};