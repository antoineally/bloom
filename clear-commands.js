const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const guildId = '1498441027428548709';   // Ton Server ID
const clientId = '1515839450196873376';  // Ton Bot ID

async function clearAll() {
    try {
        console.log('🗑️ Suppression de toutes les commandes...');

        // Supprime les commandes du serveur
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] }
        );
        console.log('✅ Commandes du serveur supprimées');

        // Supprime aussi les commandes globales
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: [] }
        );
        console.log('✅ Commandes globales supprimées');

        console.log('\n🎉 Nettoyage terminé ! Tu peux maintenant relancer ton bot.');

    } catch (error) {
        console.error('❌ Erreur :', error.rawError || error);
    }
}

clearAll();