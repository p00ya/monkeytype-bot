const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with helpful reinforcements.'),
	async execute(interaction) {
        let guild = interaction.guild;

        const row = new MessageActionRow()
		.addComponents(
            new MessageButton()
                .setCustomId('stats')
                .setLabel('📈Stats')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('info')
                .setLabel('❓Info')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('banana')
                .setLabel('🍌Banana')
                .setStyle('SECONDARY'),
		);
        
        try {
            const helpEmbed = new MessageEmbed()
            .setColor("#e2b714")
            .setTitle("Monkey Type Help")
            .setThumbnail(
                guild.iconURL({ format: "png", dynamic: true, size: 256 })
            )
            .addFields(
                { name: "Personal Bests & Statistics:", value: "React with 📈 for stats commands help" },
                { name: "Server Info:", value: "React with ❓ for server info commands help" },
                { name: "Banana:", value: "React with 🍌 for banana commands help" }
            )
            .setFooter("www.monkeytype.com", guild.iconURL({ dynamic: true }));

            interaction.reply({ embeds: [helpEmbed], components: [row] });

            const filter = i => i.customId === 'stats' || i.customId === 'info' || i.customId === 'banana';

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

            collector.on('collect', async i => {
                if (i.customId === 'stats') {
                    helpEmbed.fields = [];
                    helpEmbed.setTitle("📈 Stats Help")
                    .addFields(
                        { name: "!pb", value: "Displays personal bests for worded and timed tests\nYou cannot view other users scores with this command" },
                        { name: "!stats", value: "Displays the number of tests completed and total time typing\nYou cannot view other users score with this command" }
                    );

                    await i.update({ embeds: [helpEmbed] });
                } else if (i.customId === 'info') {
                    helpEmbed.fields = [];
                    helpEmbed.setTitle("❓ Server Info Help")
                    .addFields({ name: "!inrole <role name>", value: "Displays number of members within the role queried" });

                    await i.update({ embeds: [helpEmbed] });
                } else if (i.customId === 'banana') {
                    helpEmbed.fields = [];
                    helpEmbed.setTitle("🍌 Banana Help")
                    .addFields(
                        { name: "!banana", value: "Collects 1 banana on use\nOnly can be used once per day - because you know what they say!" },
                        { name: "!bananatop", value: "Displays the biggest potassium hoarders serverwide!" },
                        { name: "!donate", value: "Be a good friend and share your nanners with others! Format: !donate <@user> <amount>" },
                        { name: "!bananaflip", value: "Bet your bananas in a coin flip! Format: !bananaflip <amount> <heads/tails>" },
                        { name: "!bananajack", value: "Bet your bananas in a game of blackjack agaisnt George! Format: !bananajack <amount>" },
                        { name: "!rps", value: "Go against George in a battle of Rock Paper Scissors! Format: !rps <amount>" }
                    );

                    await i.update({ embeds: [helpEmbed] });
                }
            });

            collector.on('end', () => interaction.editReply({ embeds: [helpEmbed], components: [] }));

        } catch (error) {
            interaction.reply(':x: An error has occurred.')
        };
        
	},
};