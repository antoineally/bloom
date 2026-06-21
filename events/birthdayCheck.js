const { Events, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const path = require('path');
const cron = require('node-cron');

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log('🎂 Birthday system loaded (CRON MODE)');

        const db = new Database(path.join(__dirname, '../data/birthdays.db'));

        db.prepare(`
            CREATE TABLE IF NOT EXISTS birthdays (
                userId TEXT PRIMARY KEY,
                date TEXT NOT NULL
            )
        `).run();

        // table anti-doublon (restart safe)
        db.prepare(`
            CREATE TABLE IF NOT EXISTS birthday_logs (
                date TEXT PRIMARY KEY
            )
        `).run();

        const birthdayGifs = [
            'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2NlMGFkNDJ2a2Frb21oNmZreWRwYmgzMnFqMWs3NHZvbzR2NmppeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yoJC2GnSClbPOkV0eA/giphy.gif',
            'https://media.tenor.com/wCo1AiSrB10AAAAm/pengu-pudgy.webp',
            'https://media.tenor.com/Kalf1rXmrxIAAAAm/happy-birthday.webp'
        ];

        const birthdayMessages = [
            userId => `🎂 Today we celebrate <@${userId}>!`,
            userId => `🥳 Happy Birthday <@${userId}>!`,
            userId => `🎉 Wishing a great day to <@${userId}>!`
        ];

        // CRON: tous les jours à 09:00 Montréal
        cron.schedule('0 9 * * *', async () => {
            try {
                console.log('🎂 CRON triggered (09:00 Montreal)');

                const now = new Date();

                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'America/Montreal',
                    month: '2-digit',
                    day: '2-digit'
                });

                const [month, day] = formatter.format(now).split('/');
                const today = `${month}-${day}`;

                // 🔥 anti restart / anti double envoi (DB)
                const alreadySent = db.prepare(`
                    SELECT date FROM birthday_logs WHERE date = ?
                `).get(today);

                if (alreadySent) {
                    console.log(`⚠️ Already sent for ${today}`);
                    return;
                }

                const rows = db.prepare(`
                    SELECT userId FROM birthdays WHERE date = ?
                `).all(today);

                console.log(`🎂 Found ${rows.length} birthdays for ${today}`);

                const guild = client.guilds.cache.first();
                if (!guild) return console.error('❌ No guild found');

                const channel = guild.channels.cache.get(
                    process.env.BIRTHDAY_CHANNEL_ID
                );

                if (!channel) return console.error('❌ Missing channel ID');

                if (!rows.length) {
                    db.prepare(`
                        INSERT OR IGNORE INTO birthday_logs (date)
                        VALUES (?)
                    `).run(today);
                    return;
                }

                for (const row of rows) {
                    try {
                        const member = await guild.members.fetch(row.userId).catch(() => null);
                        if (!member) continue;

                        const embed = new EmbedBuilder()
                            .setColor(0x7C3AED)
                            .setTitle('🎉 Happy Birthday!')
                            .setDescription(
                                birthdayMessages[
                                    Math.floor(Math.random() * birthdayMessages.length)
                                ](row.userId)
                            )
                            .setThumbnail(member.user.displayAvatarURL())
                            .setImage(
                                birthdayGifs[
                                    Math.floor(Math.random() * birthdayGifs.length)
                                ]
                            )
                            .setFooter({ text: 'Birthday System 🎂' });

                        await channel.send({
                            content: '@everyone 🎉',
                            allowedMentions: { parse: ['everyone'] },
                            embeds: [embed]
                        });

                        console.log(`✅ Sent birthday for ${member.user.tag}`);

                    } catch (err) {
                        console.error('❌ Error sending birthday:', err);
                    }
                }

                // marque comme envoyé (restart safe)
                db.prepare(`
                    INSERT OR IGNORE INTO birthday_logs (date)
                    VALUES (?)
                `).run(today);

            } catch (err) {
                console.error('❌ CRON error:', err);
            }
        }, {
            timezone: 'America/Montreal'
        });
    }
};