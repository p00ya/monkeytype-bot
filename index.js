const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, guildId, roles } = require('./config.json');
const { needMod } = require('./commands/help');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command, command.needMod);
}

client.once("ready", async () => {
  console.log("Ready");
  guild = client.guilds.cache.get(guildId);
  await guild.fetch();
  client.user.setActivity(`over ${guild.approximatePresenceCount} monkeys`, {
    type: "WATCHING",
  });
  setInterval(async () => {
    guild = bot.guilds.cache.get(guildId);
    await guild.fetch();
    client.user.setActivity(`over ${guild.approximatePresenceCount} monkeys`, {
      type: "WATCHING",
    });
  }, 3600000);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

  let member = await interaction.guild.members.fetch(interaction.user);

  if (command.needMod === true) {
    if (!member.roles.cache.has(roles.modRole) || !member.roles.cache.has(roles.adminRole)) return interaction.reply({ content: ":x: You do not have permission to use this command.", ephemeral: true }); //if the user doesnt have mod/admin return
  }; //note: ephermeral means only the user who created the interaction can see the message (i.e. no one else will see that the interaction was triggered)

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: ':x: There was an error while executing this command.', ephemeral: true });
	}
});

client.login(token);
