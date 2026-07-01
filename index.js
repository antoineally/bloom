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
   UTILS
========================= */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function smartPick(arr, message) {
    const seed = message.content.length + message.author.id.charCodeAt(0);
    return arr[seed % arr.length];
}
const cooldown = new Map();
const userMemory = new Map();

/* =========================
   MOOD DETECTION
========================= */

function detectMood(content) {
    const text = content.toLowerCase();

    const moods = {
        positive: [
            "thanks","thank you","awesome",
            "great","amazing","perfect","nice"
        ],

        negative: [
            "hate","bad","awful","terrible",
            "sad","angry","worst"
        ],

        fun: [
            "lol","lmao","rofl","xd",
            "😂","🤣","meme"
        ],

        hype: [
            "wow","wtf","insane",
            "crazy","fire","legendary"
        ],

        love: [
            "love","❤️","cute",
            "adorable","beautiful"
        ]
    };

    let bestMood = "neutral";
    let bestScore = 0;

    for (const [mood, words] of Object.entries(moods)) {

        let score = 0;

        for (const word of words) {

            const regex = new RegExp(
                `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                "i"
            );

            if (regex.test(text))
                score += 2;

            if (text.includes(word))
                score++;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMood = mood;
        }
    }

    return bestMood;
}

/* =========================
   INTENT DETECTION
========================= */

function detectIntent(content) {

    const text = content.toLowerCase();

    const intents = {
        greeting: [
            "hi","hello","hey","yo","sup"
        ],

        goodbye: [
            "bye","goodbye","cya",
            "goodnight","gn"
        ],

        thanks: [
            "thanks","thank you","ty"
        ]
    };

    for (const [intent, words] of Object.entries(intents)) {
        if (words.some(w => text.includes(w)))
            return intent;
    }

    if (content.includes("?"))
        return "question";

    return null;
}

/* =========================
   TOPIC DETECTION
========================= */

function detectTopic(content) {

    const text = content.toLowerCase();

    const topics = {

        gaming: [
            "game","gaming","minecraft",
            "fortnite","valorant",
            "roblox","steam","xbox"
        ],

        coding: [
            "code","coding","javascript",
            "node","python","api",
            "discord.js","bug","error"
        ],

        anime: [
            "anime","manga","naruto",
            "one piece","dragon ball"
        ],

        food: [
            "pizza","burger","food",
            "fries","chicken"
        ],

        music: [
            "music","song","album",
            "spotify","artist"
        ],

        sports: [
            "nba","football","soccer",
            "basketball","hockey"
        ]
    };

    for (const [topic, words] of Object.entries(topics)) {
        if (words.some(w => text.includes(w)))
            return topic;
    }

    return null;
}

/* =========================
   RESPONSES
========================= */

const RESPONSES = {

    greeting: [
        "Hey 👋",
        "Yo 😎",
        "What's up?",
        "Hello there ✨"
    ],

    goodbye: [
        "See ya 👋",
        "Take care 😎",
        "Catch you later ✨"
    ],

    thanks: [
        "You're welcome 😄",
        "Anytime 👍",
        "Glad I could help ✨"
    ],

    question: [
        "Good question 🤔",
        "Interesting 👀",
        "Now you've got me thinking 🤔"
    ],

    positive: [
        "Huge W 🔥",
        "Love to hear it 👑",
        "That's awesome 💯"
    ],

    negative: [
        "Ouch 😬",
        "That's rough 💀",
        "Big yikes 😭"
    ],

    fun: [
        "LMAO 😂",
        "I'm dead 💀",
        "That's hilarious 🤣"
    ],

    hype: [
        "LET'S GO 🔥",
        "Massive W 🚀",
        "That's insane 🤯"
    ],

    love: [
        "Awww ❤️",
        "Wholesome 🥰",
        "That's adorable 💖"
    ]
};

/* =========================
   TOPIC REPLIES
========================= */

function topicReply(topic) {

    const replies = {

        gaming: [
            "Gamer detected 🎮",
            "Sounds like a ranked experience 💀",
            "GG 🔥"
        ],

        coding: [
            "Works on my machine 💻",
            "Time to debug 🐛",
            "Missing semicolon somewhere 😭"
        ],

        anime: [
            "Main character energy ⚔️",
            "Training arc begins 🔥"
        ],

        food: [
            "Now I'm hungry 🍕",
            "That sounds amazing 🤤"
        ],

        music: [
            "Certified banger 🎵",
            "Playlist worthy 🎧"
        ],

        sports: [
            "MVP moment 🏆",
            "Huge play 🔥"
        ]
    };

    return pick(replies[topic]);
}

/* =========================
   MEMORY SYSTEM
========================= */

function updateMemory(userId, content, topic, mood) {

    const memory =
        userMemory.get(userId) || {
            lastMessage: "",
            favoriteTopic: null,
            messages: 0
        };

    memory.lastMessage = content;
    memory.lastMood = mood;
    memory.messages++;

    if (topic)
        memory.favoriteTopic = topic;

    userMemory.set(userId, memory);
}

function memoryReply(userId, topic) {

    const memory = userMemory.get(userId);

    if (!memory) return null;

    if (
        memory.favoriteTopic &&
        topic &&
        memory.favoriteTopic === topic &&
        Math.random() < 0.25
    ) {

        return pick([
            `Back to ${topic} again? 😎`,
            `${topic} really is your thing 🔥`,
            `Another ${topic} moment 👀`
        ]);
    }

    return null;
}

/* =========================
   MAIN HANDLER
========================= */

client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild)
        return;

    const userId = message.author.id;

    const now = Date.now();
    const last = cooldown.get(userId) || 0;

    if (now - last < 3000)
        return;

    cooldown.set(userId, now);

    const content = message.content;
    const text = content.toLowerCase();

    const mood = detectMood(content);
    const intent = detectIntent(content);
    const topic = detectTopic(content);

    updateMemory(
        userId,
        content,
        topic,
        mood
    );

    /* COMPLIMENTS */

    if (
        ["good bot","best bot","love this bot"]
        .some(x => text.includes(x))
    ) {

        return message.reply(
            pick([
                "🥹 Thanks",
                "W user 💯",
                "Appreciate it ❤️"
            ])
        );
    }

    /* INSULTS */

    if (
        ["bad bot","trash bot","stupid bot"]
        .some(x => text.includes(x))
    ) {

        return message.reply(
            pick([
                "💀 Damn",
                "That's crazy.",
                "Skill issue."
            ])
        );
    }

    /* INTENT */

    if (
        intent &&
        RESPONSES[intent] &&
        Math.random() < 0.6
    ) {

        return message.reply(
            pick(RESPONSES[intent])
        );
    }

    /* MEMORY */

    const memReply =
        memoryReply(userId, topic);

    if (memReply && Math.random() < 0.5) {
        return message.reply(memReply);
    }

    /* TOPIC */

    if (
        topic &&
        Math.random() < 0.25
    ) {

        return message.reply(
            topicReply(topic)
        );
    }

    /* MOOD */

    if (
        Math.random() < 0.12 &&
        RESPONSES[mood]
    ) {

        return message.reply(
            pick(RESPONSES[mood])
        );
    }

    /* REACTIONS */

    if (Math.random() < 0.65) {

        const emojiPool = {
            positive: ["🔥","💯","👏"],
            negative: ["💀","😬"],
            fun: ["😂","🤣"],
            hype: ["🚀","🔥"],
            love: ["❤️","🥰"],
            neutral: ["👀","🤔"]
        };

        const emoji =
            pick(
                emojiPool[mood] ||
                emojiPool.neutral
            );

        message.react(emoji)
            .catch(() => {});
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
    const db = nicknameStore.getAll();
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
