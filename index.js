const fs = require('fs');
const path = require('path');
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require('discord.js');

require('dotenv').config();

const nicknameStore = require('./utils/nicknameStore');

/* =========================
   CLIENT
========================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/* =========================
   SAFE ERRORS
========================= */

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

/* =========================
   MEMORY / SYSTEMS
========================= */

const cooldown = new Map();
const userMemory = new Map();

/* =========================
   UTILS
========================= */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function smartPick(arr, message) {
    const seed = message.content.length + message.author.id.charCodeAt(0);
    return arr[seed % arr.length];
}

/* =========================
   MOOD DETECTION (SMART)
========================= */

function detectMood(msg) {
    const text = msg.toLowerCase();

    const scores = {
        fun: 0,
        positive: 0,
        negative: 0,
        hype: 0,
        love: 0,
        troll: 0,
        shock: 0,
        neutral: 1
    };

    const rules = [
        { mood: "fun", regex: /mdr|lol|xd|lmao/g, weight: 2 },
        { mood: "positive", regex: /thanks|cool|gg|nice|good job/g, weight: 2 },
        { mood: "negative", regex: /bad|rage|angry|trash|hate/g, weight: 2 },
        { mood: "hype", regex: /wow|insane|crazy|fire|wtf/g, weight: 2 },
        { mood: "love", regex: /love|❤️|i love you|cute/g, weight: 3 },
        { mood: "troll", regex: /stupid|idiot|skill issue/g, weight: 2 },
        { mood: "shock", regex: /omg|no way|what the fuck|wtf/g, weight: 2 }
    ];

    for (const rule of rules) {
        const matches = text.match(rule.regex);
        if (matches) scores[rule.mood] += matches.length * rule.weight;
    }

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

    return best[1] > 0 ? best[0] : "neutral";
}

/* =========================
   MOODS DATA
========================= */

const MOODS = {
    fun: {
        reactions: ["😂", "🤣", "💀", "😭", "😹"],
        replies: ["lol 💀 that’s crazy", "I lost it 😂", "I’m done 😭"]
    },

    positive: {
        reactions: ["👍", "👏", "🙏", "✨", "🔥"],
        replies: ["good job 👍", "clean work 🔥", "respect 🙏"]
    },

    negative: {
        reactions: ["🤡", "📉", "😡", "💢", "🗑️"],
        replies: ["ouch… 😬", "that’s rough 💀", "rip 📉"]
    },

    hype: {
        reactions: ["🔥", "😎", "🤯", "⚡", "🚀"],
        replies: ["INSANE 🤯", "THIS IS CRAZY 🔥", "we’re going up 🚀"]
    },

    love: {
        reactions: ["❤️", "🥰", "😘", "💖", "💞"],
        replies: ["awww 🥰", "love energy ❤️", "so wholesome 💖"]
    },

    troll: {
        reactions: ["🤡", "🍅", "💀", "🪨"],
        replies: ["I’ve seen worse 🤡", "tomato worthy 🍅", "ok champ 🪨"]
    },

    shock: {
        reactions: ["😱", "🤯", "😳", "🔥"],
        replies: ["WHAT 😱", "did NOT expect that 🤯", "ok that’s serious 😳"]
    },

    neutral: {
        reactions: ["👀", "🤔", "😐", "🫥"],
        replies: ["ok 👀", "noted", "interesting 🤔"]
    }
};

/* =========================
   MESSAGE SYSTEM
========================= */

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    /* =========================
       COOLDOWN (ANTI SPAM)
    ========================= */

    const userId = message.author.id;
    const now = Date.now();
    const cd = cooldown.get(userId) || 0;

    if (now - cd < 4000) return;
    cooldown.set(userId, now);

    /* =========================
       MEMORY
    ========================= */

    const mem = userMemory.get(userId) || { count: 0 };
    mem.count++;
    userMemory.set(userId, mem);

    /* =========================
       MOOD
    ========================= */

    const mood = detectMood(message.content);
    const config = MOODS[mood];

    /* =========================
       REACTION
    ========================= */

    if (Math.random() < 0.7) {
        await message.react(pick(config.reactions)).catch(() => {});
    }

    /* =========================
       REPLY LOGIC
    ========================= */

    const isMention = message.mentions.has(client.user);
    const shouldReply = isMention || Math.random() < (message.content.length > 80 ? 0.5 : 0.2);

    if (shouldReply) {
        await message.reply(smartPick(config.replies, message)).catch(() => {});
    }

    /* =========================
       MENTION ANSWER
    ========================= */

    if (isMention) {
        const answers = ["🤖 Yes?", "👋 I’m here", "Tell me 👀"];
        await message.reply(pick(answers)).catch(() => {});
    }
});

/* =========================
   COMMAND LOADER
========================= */

client.commands = new Collection();
const commands = [];

const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
    for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
        const command = require(path.join(commandsPath, file));
        if (!command?.data || !command?.execute) continue;

        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

/* =========================
   EVENTS LOADER
========================= */

const eventsPath = path.join(__dirname, 'events');

if (fs.existsSync(eventsPath)) {
    for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(eventsPath, file));

        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }
}

/* =========================
   READY + DEPLOY
========================= */

client.once('ready', async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log(`🚀 ${commands.length} commands deployed`);
    } catch (err) {
        console.error("Deploy error:", err);
    }
});

/* =========================
   NICKNAME RESET SYSTEM
========================= */

setInterval(async () => {
    const db = nicknameStore.reload();
    const now = Date.now();

    for (const userId in db) {
        const data = db[userId];

        if (data.expireAt <= now) {
            try {
                const guild = client.guilds.cache.get(data.guildId);
                if (!guild) continue;

                const member = await guild.members.fetch(userId).catch(() => null);
                if (!member) continue;

                await member.setNickname(data.originalNick);
                nicknameStore.remove(userId);

                console.log(`🔁 Nickname reset: ${userId}`);
            } catch (err) {
                console.error(err);
            }
        }
    }
}, 60000);

/* =========================
   INTERACTIONS
========================= */

client.on('interactionCreate', async (interaction) => {
    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (command?.autocomplete) await command.autocomplete(interaction).catch(console.error);
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("Command error:", error);

        const msg = "❌ Error.";

        if (interaction.replied || interaction.deferred)
            await interaction.editReply(msg);
        else
            await interaction.reply({ content: msg, ephemeral: true });
    }
});

/* =========================
   LOGIN
========================= */

client.login(process.env.TOKEN);