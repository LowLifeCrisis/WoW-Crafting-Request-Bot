// index.js
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

// Create the client
const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

// Prepare a Collection to hold your commands
client.commands = new Collection();

// Dynamically load each command file
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const files of commandFiles) {
  const filePath = path.join(commandsPath, files);
  const command  = require(filePath);
  // Expect each command module to export { data, execute }
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] ${files} is missing a required "data" or "execute" export.`
    );
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  // Look up the command in your Collection
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} found.`);
    return;
  }

  try {
    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '🚨 There was an error executing this command!',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '🚨 There was an error executing this command!',
        ephemeral: true
      });
    }
  }
});

// Load all commands 
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 Registering ${client.commands.size} slash commands…`);
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: client.commands.map(cmd => cmd.data) }
    );
    console.log('✅ Slash commands registered.');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
})();



client.login(process.env.DISCORD_TOKEN);
