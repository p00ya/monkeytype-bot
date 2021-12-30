const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with helpful reinforcements.'),
	async execute(interaction) {
        let guild = interaction.guild;

        //help command try catch statement

        try {
            const helpEmbed = new MessageEmbed()
            .setColor("#e2b714")
            .setTitle("Monkey Type Help")
            .setThumbnail(
                guild.iconURL({ format: "png", dynamic: true, size: 256 })
            )
            .addFields(
                {
                name: "Personal Bests & Statistics:",
                value: "React with 📈 for stats commands help",
                },
                {
                name: "Server Info:",
                value: "React with ❓ for server info commands help",
                },
                { name: "Banana:", value: "React with 🍌 for banana commands help" }
            )
            .setFooter("www.monkeytype.com");

            var msg = await interaction.reply({ embeds: [helpEmbed], fetchReply: true });


            await msg.react("📈"); //stats
            await msg.react("❓"); //server info
            await msg.react("🍌"); //banana

            const filter = (reaction) =>
            ["📈", "❓", "🍌"].includes(reaction.emoji.name);

            var collected = await msg.awaitReactions({ filter, time: 10000, max:1 }); //one of the main changes of v13 was that most 'options' must be sent as sole objects
            if (collected.size == 0){
                interaction.reply("You didn't react in time for help!");
                return console.log('dingus')
            };

            if (collected.find((v) => v.emoji.name === "📈")) {
            helpEmbed.fields = [];
            helpEmbed.setTitle("📈 Stats Help")
            .addFields(
                {
                name: "!pb",
                value:
                    "Displays personal bests for worded and timed tests\nYou cannot view other users scores with this command",
                },
                {
                name: "!stats",
                value:
                    "Displays the number of tests completed and total time typing\nYou cannot view other users score with this command",
                }
            );

            await msg.edit({ embeds: [helpEmbed] }); //embeds must always be sent as a sole object
            return; //do nothing
            } else if (collected.find((v) => v.emoji.name === "❓")) {
            helpEmbed.fields = [];
            helpEmbed.setTitle("❓ Server Info Help")
            .addFields({
                name: "!inrole <role name>",
                value: "Displays number of members within the role queried",
            })
            await msg.edit({ embeds: [helpEmbed] }); 
            return; //do nothing
            } else if (collected.find((v) => v.emoji.name === "🍌")) {
            helpEmbed.fields = [];
            helpEmbed.setTitle("🍌 Banana Help")
            .addFields(
                {
                name: "!banana",
                value:
                    "Collects 1 banana on use\nOnly can be used once per day - because you know what they say!",
                },
                {
                name: "!bananatop",
                value: "Displays the biggest potassium hoarders serverwide!",
                },
                {
                name: "!donate",
                value:
                    "Be a good friend and share your nanners with others! Format: !donate <@user> <amount>",
                },
                {
                name: "!bananaflip",
                value:
                    "Bet your bananas in a coin flip! Format: !bananaflip <amount> <heads/tails>",
                },
                {
                name: "!bananajack",
                value:
                    "Bet your bananas in a game of blackjack agaisnt George! Format: !bananajack <amount>",
                },
                {
                name: "!rps",
                value:
                    "Go against George in a battle of Rock Paper Scissors! Format: !rps <amount>",
                }
            )
            await msg.edit({ embeds: [helpEmbed] });
            return; //do nothing
            } else {
            //do nothing
            return;
            }
        } catch (error) {
            interaction.reply(`:x: An error has occurred`); 
        }
    },
};