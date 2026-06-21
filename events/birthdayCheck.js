const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log('🎂 Birthday system loaded (JSON MODE)');

        const DB_PATH = path.join(__dirname, '../data/birthdays.json');

        /* ================= LOAD JSON ================= */
        function loadDB() {
            try {
                if (!fs.existsSync(DB_PATH)) return {};
                return JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
            } catch (err) {
                console.error('DB load error:', err);
                return {};
            }
        }

        /* ================= SAVE JSON ================= */
        function saveDB(data) {
            try {
                const tmp = DB_PATH + '.tmp';
                fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
                fs.renameSync(tmp, DB_PATH);
            } catch (err) {
                console.error('DB save error:', err);
            }
        }

        /* ================= LOGS FILE ================= */
        const LOG_PATH = path.join(__dirname, '../data/birthday_logs.json');

        function loadLogs() {
            try {
                if (!fs.existsSync(LOG_PATH)) return {};
                return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8') || '{}');
            } catch {
                return {};
            }
        }

        function saveLogs(data) {
            try {
                const tmp = LOG_PATH + '.tmp';
                fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
                fs.renameSync(tmp, LOG_PATH);
            } catch (err) {
                console.error('Logs error:', err);
            }
        }

        const birthdayGifs = [
            'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2NlMGFkNDJ2a2Frb21oNmZreWRwYmgzMnFqMWs3NHZvbzR2NmppeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yoJC2GnSClbPOkV0eA/giphy.gif',
            'https://media.tenor.com/wCo1AiSrB10AAAAm/pengu-pudgy.webp',
            'https://media.tenor.com/Kalf1rXmrxIAAAAm/happy-birthday.webp'
        ];

        const birthdayMessages = [
            id => `🎂 Today we celebrate <@${id}>!`,
            id => `🥳 Happy Birthday <@${id}>!`,
            id => `🎉 Wishing a great day to <@${id}>!`
        ];

        /* ================= CRON ================= */
        cron.schedule('0 9 * * *', async () => {
            try {
                console.log('🎂 CRON triggered (09:00 Montreal)');

                const db = loadDB();
                const logs = loadLogs();

                const now = new Date();

                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'America/Montreal',
                    month: '2-digit',
                    day: '2-digit'
                });

                const [month, day] = formatter.format(now).split('/');
                const today = `${month}-${day}`;

                /* anti double send */
                if (logs[today]) {
                    console.log(`⚠️ Already sent for ${today}`);
                    return;
                }

                const users = Object.entries(db)
                    .filter(([_, data]) => data?.date === today)
                    .map(([userId]) => userId);

                console.log(`🎂 Found ${users.length} birthdays for ${today}`);

                const guild = client.guilds.cache.first();
                if (!guild) return console.error('❌ No guild found');

                const channel = guild.channels.cache.get(
                    process.env.BIRTHDAY_CHANNEL_ID
                );

                if (!channel) return console.error('❌ Missing channel ID');

                if (!users.length) {
                    logs[today] = true;
                    saveLogs(logs);
                    return;
                }

                for (const userId of users) {
                    try {
                        const member = await guild.members.fetch(userId).catch(() => null);
                        if (!member) continue;

                        const embed = new EmbedBuilder()
                            .setColor(0x7C3AED)
                            .setTitle('🎉 Happy Birthday!')
                            .setDescription(
                                birthdayMessages[
                                    Math.floor(Math.random() * birthdayMessages.length)
                                ](userId)
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

                logs[today] = true;
                saveLogs(logs);

            } catch (err) {
                console.error('❌ CRON error:', err);
            }
        }, {
            timezone: 'America/Montreal'
        });
    }
};