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
   ADVANCED CHATBOT ENGINE
========================= */


function randomChance(percent) {
    return Math.random() * 100 < percent;
}

/* =========================
   MEMORY SYSTEM (Enhanced)
========================= */
function updateMemory(userId, content, mood, topic, intent) {
    let memory = userMemory.get(userId) || {
        username: `User${userId.slice(0,4)}`,
        messages: 0,
        lastMessage: "",
        lastMood: "neutral",
        favoriteTopic: null,
        conversationStreak: 0,
        topicsHistory: [],
        lastInteraction: Date.now()
    };

    memory.messages++;
    memory.lastMessage = content;
    memory.lastMood = mood;
    memory.lastInteraction = Date.now();

    if (topic) {
        memory.favoriteTopic = topic;
        memory.topicsHistory.push(topic);
        if (memory.topicsHistory.length > 8) memory.topicsHistory.shift();
    }

    if (intent === "greeting") memory.conversationStreak = 1;
    else memory.conversationStreak++;

    userMemory.set(userId, memory);
    return memory;
}

/* =========================
   MOOD DETECTION (More accurate)
========================= */
function detectMood(content) {
    const text = content.toLowerCase().trim();
    
    const moodScores = {
        positive: 0,
        negative: 0,
        fun: 0,
        hype: 0,
        love: 0,
        frustrated: 0,
        curious: 0
    };

    const keywords = {
        positive: ["great", "awesome", "amazing", "good", "nice", "love", "perfect", "excellent", "happy", "thanks", "thank"],
        negative: ["hate", "bad", "awful", "terrible", "worst", "sad", "angry", "annoying", "stupid"],
        fun: ["lol", "lmao", "rofl", "haha", "xd", "😂", "🤣", "meme", "funny"],
        hype: ["wow", "insane", "crazy", "fire", "legendary", "goat", "wtf", "🔥"],
        love: ["love", "❤️", "cute", "adorable", "beautiful", "crush", "heart"],
        frustrated: ["wtf", "why", "can't", "broken", "stuck", "help", "fix"],
        curious: ["how", "why", "what if", "explain", "?"]
    };

    for (const [mood, words] of Object.entries(keywords)) {
        for (const word of words) {
            if (text.includes(word)) {
                moodScores[mood] += word.length > 3 ? 2 : 1;
            }
        }
    }

    let bestMood = "neutral";
    let highestScore = 0;

    for (const [mood, score] of Object.entries(moodScores)) {
        if (score > highestScore) {
            highestScore = score;
            bestMood = mood;
        }
    }

    return bestMood;
}

/* =========================
   INTENT & TOPIC DETECTION
========================= */
function detectIntent(content) {
    const text = content.toLowerCase();
    
    if (["hi", "hello", "hey", "sup", "yo", "morning", "evening"].some(w => text.includes(w))) 
        return "greeting";
    if (["bye", "goodbye", "cya", "see ya", "goodnight"].some(w => text.includes(w))) 
        return "goodbye";
    if (["thanks", "thank you", "ty", "merci"].some(w => text.includes(w))) 
        return "thanks";
    if (text.includes("?")) return "question";

    return "statement";
}

function detectTopic(content) {
    const text = content.toLowerCase();
    
    const topics = {
        gaming: ["game", "gaming", "minecraft", "fortnite", "valorant", "league", "ranked", "lol"],
        coding: ["code", "coding", "javascript", "python", "bug", "error", "debug", "api"],
        anime: ["anime", "manga", "one piece", "jujutsu", "chainsaw", "naruto"],
        music: ["music", "song", "album", "spotify", "playlist", "artist"],
        food: ["food", "pizza", "burger", "eat", "hungry", "restaurant"],
        sports: ["nba", "football", "soccer", "basketball", "match"],
        life: ["life", "work", "school", "study", "tired", "stress"]
    };

    for (const [topic, words] of Object.entries(topics)) {
        if (words.some(w => text.includes(w))) return topic;
    }
    return null;
}

/* =========================
   RESPONSE DATABASE (Rich & Varied)
========================= */
const RESPONSES = {
    greeting: [
        "Hey! What's the vibe today? 😊",
        "Yo! Good to see you ✨",
        "Hello legend, what's up?",
        "Hey there! Missed you 👀"
    ],
    goodbye: [
        "Catch you later! Take care 🔥",
        "Bye legend 👋 Stay awesome",
        "See ya! Don't forget to hydrate 💧"
    ],
    thanks: [
        "Always happy to help 😊",
        "No problem at all!",
        "My pleasure ✨"
    ],
    question: [
        "Ooh, good question...",
        "Let me think about that 👀",
        "Hmm, interesting..."
    ]
};

// Dynamic replies based on mood + topic
function getContextualReply(mood, topic, memory) {
    const replies = [];

    // Mood-based
    if (mood === "positive") replies.push(...[
        "Love this energy! 🔥",
        "You're glowing today ✨",
        "This is the vibe I live for"
    ]);

    if (mood === "fun") replies.push(...[
        "I'm actually crying 😂",
        "You got me dying over here",
        "This is too good"
    ]);

    if (mood === "hype") replies.push(...[
        "LETS GOOOOO 🚀",
        "The energy is insane rn",
        "You're on demon time 🔥"
    ]);

    if (mood === "love") replies.push(...[
        "Aww stop, my heart 💕",
        "This is too cute",
        "Wholesome overload 🥰"
    ]);

    if (mood === "frustrated") replies.push(...[
        "Damn, that sucks... Want to vent?",
        "I'm here if you need to rant 💪",
        "Take a breath, we got this"
    ]);

    // Topic-based
    if (topic === "gaming") replies.push(...[
        "Gamer moment detected 🎮",
        "You trying to hit Immortal or what?",
        "What's the current ranked struggle?"
    ]);

    if (topic === "coding") replies.push(...[
        "Developer hours... I respect it 💻",
        "Stack overflow hitting different today?",
        "We debugging or we cooking?"
    ]);

    // Memory-aware
    if (memory && memory.messages > 5 && randomChance(35)) {
        replies.push(`We've been talking for a minute now, I like this energy 👀`);
    }

    return replies.length > 0 ? pick(replies) : null;
}

/* =========================
   MAIN MESSAGE HANDLER
========================= */
function processMessage(userId, content, username = null) {
    const mood = detectMood(content);
    const intent = detectIntent(content);
    const topic = detectTopic(content);
    
    const memory = updateMemory(userId, content, mood, topic, intent);
    if (username) memory.username = username;

    // 1. Specific Intent Handling
    if (intent === "greeting" || intent === "goodbye" || intent === "thanks") {
        return pick(RESPONSES[intent]);
    }

    // 2. Contextual Smart Reply
    let reply = getContextualReply(mood, topic, memory);
    if (reply) return reply;

    // 3. Topic Reply
    if (topic) {
        const topicReplies = {
            gaming: ["You playing anything good lately?", "What's the current meta looking like?"],
            coding: ["What are you building right now?", "Any cool projects in the works?"],
            anime: ["You caught up with the latest season?"],
            music: ["Drop your current favorite song 👀"]
        };
        return pick(topicReplies[topic] || ["Tell me more about that!"]);
    }

    // 4. Mood-based fallback
    if (mood === "curious" || intent === "question") {
        return "That's actually a deep one... What's your take on it?";
    }

    // 5. Generic but natural replies
    const generics = [
        "No way, tell me more 👀",
        "You're actually onto something...",
        "This conversation is getting good",
        "I'm locked in, keep going",
        "Wait... fr? 😂"
    ];

    return pick(generics);
}

// For testing
function simulateChat(userId, message) {
    console.log(`User: ${message}`);
    const response = processMessage(userId, message);
    console.log(`Bot: ${response}\n`);
    return response;
}

module.exports = { processMessage, simulateChat };
function topicReply(topic) {
    const replies = {
        gaming: [
            "What are you playing lately?",
            "Grinding ranked again?"
        ],
        coding: [
            "Working on a cool project?",
            "Any bugs today? 💀"
        ],
        anime: [
            "Watching anything good this season?"
        ],
        music: [
            "What's on repeat right now?"
        ],
        food: [
            "Now I'm hungry 😂"
        ],
        sports: [
            "Who are you rooting for?"
        ],
        life: [
            "Hope everything's going well 💪"
        ]
    };

    return pick(replies[topic] || ["Tell me more!"]);
}
/* =========================
   MAIN HANDLER
========================= */

function memoryReply(userId, topic) {
    const memory = userMemory.get(userId);

    if (!memory) return null;

    if (
        topic &&
        memory.favoriteTopic &&
        topic === memory.favoriteTopic &&
        memory.messages > 3
    ) {
        return `You're really into ${topic} lately 👀`;
    }

    return null;
}

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
    mood,
    topic,
    intent
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
