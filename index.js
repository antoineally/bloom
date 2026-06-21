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

/* =========================
   SQLITE (BETTER-SQLITE3)
========================= */

const Database = require("better-sqlite3");
const db = new Database("database.db");

/* =========================
   CLIENT DISCORD
========================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commands = [];

/* =========================
   TABLE INIT SQLITE
========================= */

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    coins INTEGER DEFAULT 0
)
`).run();

/* =========================
   CHARGEMENT COMMANDES
========================= */

const commandsPath = path.join(__dirname, 'commands');

console.log('📂 Dossier des commandes :', commandsPath);

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

    console.log(`📄 ${commandFiles.length} commande(s) trouvée(s)`);

    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsPath, file));

            if (!command.data || !command.execute) {
                console.warn(`⚠️ ${file} ignoré`);
                continue;
            }

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());

            console.log(`✅ Chargé : ${command.data.name}`);
        } catch (err) {
            console.error(`❌ Erreur ${file} :`, err);
        }
    }
}

/* =========================
   CHARGEMENT EVENTS
========================= */

const eventsPath = path.join(__dirname, 'events');

if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath)
        .filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

/* =========================
   READY
========================= */

client.once('ready', async () => {
    console.log(`🤖 Connecté en tant que ${client.user.tag}`);

    const rows = db.prepare("SELECT * FROM users").all();
    console.log("📋 Users :", rows);

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log(`🚀 ${commands.length} commande(s) déployée(s)`);
    } catch (error) {
        console.error('❌ Erreur deploy commands:', error);
    }
});

/* =========================
   INTERACTIONS
========================= */

client.on('interactionCreate', async interaction => {
    /* =========================
       AUTOCOMPLETE
    ========================= */
    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;

        try {
            await command.autocomplete(interaction);
        } catch (err) {
            console.error("Autocomplete error:", err);
        }
        return;
    }

    /* =========================
       COMMANDS SLASH
    ========================= */
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, db);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply('❌ Erreur.');
        } else {
            await interaction.reply({ content: '❌ Erreur.', ephemeral: true });
        }
    }
});

/* =========================
   LOGIN
========================= */

client.login(process.env.TOKEN);
