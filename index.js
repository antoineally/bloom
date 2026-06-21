const fs = require('fs');
const path = require('path');
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require('discord.js');

const mysql = require('mysql2/promise');
require('dotenv').config();

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
   MYSQL (GLOBAL)
========================= */

let db;

/* =========================
   CHARGEMENT COMMANDES
========================= */

const commandsPath = path.join(__dirname, 'commands');

console.log('📂 Dossier des commandes :', commandsPath);

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

    console.log(`📄 ${commandFiles.length} fichier(s) trouvé(s)`);

    for (const file of commandFiles) {
        try {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (!command.data || !command.execute) {
                console.warn(`⚠️ ${file} ignoré (data ou execute manquant)`);
                continue;
            }

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());

            console.log(`✅ Commande chargée : ${command.data.name}`);
        } catch (error) {
            console.error(`❌ Erreur dans ${file} :`, error);
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

    /* 🔥 MYSQL CONNECTION */
    try {
        db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "test"
        });

        global.db = db;

        console.log("✅ Connecté à MySQL");
    } catch (err) {
        console.error("❌ Erreur MySQL :", err);
    }

    /* 🚀 DEPLOY COMMANDS */
    try {
        const rest = new REST({ version: '10' })
            .setToken(process.env.TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log(`🚀 ${commands.length} commande(s) déployée(s)`);
    } catch (error) {
        console.error('❌ Erreur de déploiement :', error);
    }
});

/* =========================
   INTERACTIONS
========================= */

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({
                content: '❌ Une erreur est survenue.'
            });
        } else {
            await interaction.reply({
                content: '❌ Une erreur est survenue.',
                ephemeral: true
            });
        }
    }
});

/* =========================
   LOGIN
========================= */

client.login(process.env.TOKEN);