const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { connectDB, mongoDB } = require("../mongodb.js");
const fs = require("fs").promises;
const config = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banana')
		.setDescription('Collects your daily banana allowance.'),
	async execute(interaction) {

        let discordID = interaction.user.id;     

        try {
            let bananaData;
            try {
                bananaData = JSON.parse(await fs.readFile("bananas.json"));
            } catch (e) {
                await fs.writeFile("bananas.json", "{}");
                bananaData = {};
            }

            let t60bananas = 0;

            await mongoDB().collection("users").findOne({ discordId: discordID })
            .then(async (snapshot) => {
                if (!snapshot) {
                interaction.reply({ text: ":x: Could not find user. Make sure your accounts are paired." });
                t60bananas = 0;
                } else {
                //get that users bananas subcollection
                try {
                    t60bananas = snapshot.bananas;
                } catch (e) {}
                //bananasDoc.set({t60bananas: 0}, {merge: true});
                }
            });

            let userData = bananaData[interaction.user.id];
            let milisNow = Date.now();
            if (userData === undefined) {
            //no user found, add a new one
            bananaData[interaction.user.id] = {
                balance: 1,
                lastCollect: milisNow,
            };
            //success show balance
            await fs.writeFile("bananas.json", JSON.stringify(bananaData));
            let nextReset = addDays(milisNow, 1);
            nextReset.setHours(0);
            nextReset.setMinutes(0);
            nextReset.setSeconds(0);
            nextReset.setMilliseconds(0);

            let dateDiff = Math.floor((nextReset - milisNow) / 1000);

            let th = Math.floor(dateDiff / 3600);
            let tm = Math.floor((dateDiff % 3600) / 60);
            let ts = Math.floor((dateDiff % 3600) % 60);

            let timeLeftString = "";
            if (th > 0) {
                timeLeftString = th === 1 ? `${th} hour` : `${th} hours`;
            } else if (tm > 0) {
                timeLeftString = tm === 1 ? `${tm} minute` : `${tm} minutes`;
            } else if (ts > 0) {
                timeLeftString = ts === 1 ? `${ts} second` : `${ts} seconds`;
            }
            let embed = new MessageEmbed()
                .setColor("#e2b714")
                .setTitle(`${interaction.user.username}'s Bananas`)
                .setThumbnail(
                "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/banana_1f34c.png"
                )
                .setDescription(
                `Banana collected! Come back in ${timeLeftString} for more.`
                )
                .addField("Bananas", 1)
                .setFooter("www.monkeytype.com");

            if (t60bananas > 0) {
                embed.addField("Bonus! :partying_face::", t60bananas);
            }

            interaction.reply({ embeds : [embed] });

            if (
                t60bananas !== undefined &&
                t60bananas !== 0
            ) {
                bananaData = JSON.parse(await fs.readFile("bananas.json"));
                bananaData[interaction.user.id].balance += t60bananas;
                await fs.writeFile("bananas.json", JSON.stringify(bananaData));
                mongoDB().collection("users").updateOne({discordId: discordID},  {$set: { bananas: 0 }})
            }

            return;
            } else {
            //else user found incrementing and setting last collect data
            //check if user already collected today
            let cD = new Date(userData.lastCollect);
            let mN = new Date(milisNow);
            if (
                cD.getUTCFullYear() === mN.getUTCFullYear() &&
                cD.getUTCMonth() === mN.getUTCMonth() &&
                cD.getUTCDate() === mN.getUTCDate()
            ) {
                //same day, show error
                let nextReset = addDays(cD, 1);
                nextReset.setHours(0);
                nextReset.setMinutes(0);
                nextReset.setSeconds(0);
                nextReset.setMilliseconds(0);

                let dateDiff = Math.floor((nextReset - milisNow) / 1000);

                let th = Math.floor(dateDiff / 3600);
                let tm = Math.floor((dateDiff % 3600) / 60);
                let ts = Math.floor((dateDiff % 3600) % 60);

                let timeLeftString = "";
                if (th > 0) {
                timeLeftString = th === 1 ? `${th} hour` : `${th} hours`;
                } else if (tm > 0) {
                timeLeftString = tm === 1 ? `${tm} minute` : `${tm} minutes`;
                } else if (ts > 0) {
                timeLeftString = ts === 1 ? `${ts} second` : `${ts} seconds`;
                }
                let embed = new MessageEmbed()
                .setColor("#e2b714")
                .setTitle(`${interaction.user.username}'s Bananas`)
                .setThumbnail(
                    "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/banana_1f34c.png"
                )
                .setDescription(
                    `Too early! Come back in ${timeLeftString} to collect your banana.`
                )
                .addField("Bananas", userData.balance + t60bananas)
                .setFooter("www.monkeytype.com");

                if (t60bananas > 0) {
                embed.addField("Bonus! :partying_face::", t60bananas);
                }

                interaction.reply({ embeds: [embed] });

                if (
                t60bananas !== undefined &&
                t60bananas !== 0
                ) {
                bananaData = JSON.parse(await fs.readFile("bananas.json"));
                bananaData[interaction.user.id].balance += t60bananas;
                await fs.writeFile("bananas.json", JSON.stringify(bananaData));
                mongoDB().collection("users").updateOne({discordId: discordID},  {$set: { bananas: 0 }})
                }

                return;
            } else {
                //collect banana
                // bananaData[interaction.user.id] = {
                //   balance: userData.balance + 1,
                //   lastCollect: milisNow,
                // };
                bananaData = JSON.parse(await fs.readFile("bananas.json"));
                bananaData[interaction.user.id].balance++;
                bananaData[interaction.user.id].lastCollect = milisNow;
                //success, show balance
                await fs.writeFile("bananas.json", JSON.stringify(bananaData));
                let nextReset = addDays(milisNow, 1);
                nextReset.setHours(0);
                nextReset.setMinutes(0);
                nextReset.setSeconds(0);
                nextReset.setMilliseconds(0);

                let dateDiff = Math.floor((nextReset - milisNow) / 1000);

                let th = Math.floor(dateDiff / 3600);
                let tm = Math.floor((dateDiff % 3600) / 60);
                let ts = Math.floor((dateDiff % 3600) % 60);

                let timeLeftString = "";
                if (th > 0) {
                timeLeftString = th === 1 ? `${th} hour` : `${th} hours`;
                } else if (tm > 0) {
                timeLeftString = tm === 1 ? `${tm} minute` : `${tm} minutes`;
                } else if (ts > 0) {
                timeLeftString = ts === 1 ? `${ts} second` : `${ts} seconds`;
                }
                let embed = new MessageEmbed()
                .setColor("#e2b714")
                .setTitle(`${interaction.user.username}'s Bananas`)
                .setThumbnail(
                    "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/banana_1f34c.png"
                )
                .setDescription(
                    `Banana collected! Come back in ${timeLeftString} for more.`
                )
                .addField("Bananas", userData.balance + (t60bananas ? t60bananas : 0))
                .setFooter("www.monkeytype.com");

                if (t60bananas > 0) {
                embed.addField("Bonus! :partying_face::", t60bananas);
                }

                interaction.reply({ embeds: [embed] });

                if (
                t60bananas !== undefined &&
                t60bananas !== 0
                ) {
                bananaData = JSON.parse(await fs.readFile("bananas.json"));
                bananaData[interaction.user.id].balance += t60bananas;
                await fs.writeFile("bananas.json", JSON.stringify(bananaData));
                mongoDB().collection("users").updateOne({discordId: discordID}, {$set: { bananas: 0 }})
                }

                return;
                };
            };
        } catch (error) {
            interaction.reply(':x: An error has occurred.')
        };

        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

	},
};