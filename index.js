/*

ZyapBot ReWrite
--------------------
by Beriff, Sarp and Zyapguy

Started 04/09/2021
v1.0 - 


Nightly 26/09/2021
[
    - Cleaned up log command
    
]

*/



const nightly = false; // Change to false if build is NOT nightly
const experimental = true;

let doLogging = true;



// Dependencies and requirememts
const { Client, Intents, ThreadMemberManager } = require('discord.js');
const Discord = require('discord.js');
const { MessageButton, MessageEmbed } = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');
require('dotenv').config();
var token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
let logsChannel = '883785241716731954';
const nightlyLogsChannel = '891641354034245693';
const sarpSupportTag = `<@426410106565951519>`;
const zyapSupportTag = `<@291592918592913408>`;
const prefix = "n$";
const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
const roleDictionary = {
    Helper: "Helper",
    CmMod: "Community Moderator",
    Mod: "Moderator",
    SrMod: "Senior Moderator",
    zyapguy: "zyapguy",
    Admin: "Admin"
};

const purgeDictionary = {
    Helper: 5,
    CmMod: 10,
    Mod: 25,
    SrMod: 100,
    zyapguy: 100,
    Admin: 100
};

function getTime() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

/* log(log)
// The log function is a function that will log admin actions
// into a channel and into a text file
// Written by : zyapguy */
function log(log, logtype) {
    if (doLogging) {
        client.channels.cache.get(logsChannel).send("[" + logtype + " " + getTime() + "] " + log);
        const toLog = "[" + logtype + " " + getTime() + "] " + log + "\n";

        fs.appendFile('logs.txt', toLog, function (err) {
            if (err) throw err;
            //console.log('');
        });
    }

}
function checkPermissions(message, array) {
    const role = roleToString(message.member);

    for (let i = 0; i < array.length; i++) {
        if (role == array[i]) {
            return true;
        }
    }
    //message.reply("You do not have permission to run that command!");
    return false;
}
/*
Usage of roleToString.
if (roleToString(message.member) == "Mod" || )
{
    console.log("This guy is a community mod");
}
else 
{
    message
}

*/
function roleToString(member) {
    for (var role in roleDictionary) {
        if (member.roles.cache.find(r => r.name === roleDictionary[role])) {
            console.log(role)
            return role;
        }
    }
    return "user";
    /*
    if (member.roles.cache.find(r => r.name === "Admin"))
    {
        return "Admin";
    }
    if (member.roles.cache.find(r => r.name === "zyapguy"))
    {
        return "zyapguy";
    }
    if (member.roles.cache.find(r => r.name === "Senior Moderator"))
    {
        return "SrMod";
    }
    if (member.roles.cache.find(r => r.name === "Moderator"))
    {
        return "Mod";
    }
    if (member.roles.cache.find(r => r.name === "Community Moderator"))
    {
        return "CmMod";
    }
    if (member.roles.cache.find(r => r.name === "Helper"))
    {
        return "Helper";
    }
    else {
        return "User";
    }*/
}
function purgeAuthorityValues(role) {
    for (var purge in purgeDictionary) {
        if (role == purge) {
            return purgeDictionary[purge];
        }
    }
    return 0;
    /*
    if (role == "Admin") {
        return 100;
    }
    if (role == "zyapguy") {
        return 100;
    }
    if (role == "SrMod") {
        return 100;
    }
    if (role == "Mod") {
        return 25;
    }
    if (role == "CmMod") {
        return 10;
    }
    if (role == "Helper") {
        return 5;
    }*/
}
function clamp(num, min, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}
function clampToRole(message, value) {
    let role = roleToString(message.member);
    //console.log(role);
    let val = purgeAuthorityValues(role);
    let clamped = clamp(value, 1, val);

    if (value > val) {
        message.reply(role + " can only purge " + val + " messages!");
    }
    return clamped;
}


client.on('ready', () => {
    if (nightly) {
        logsChannel = nightlyLogsChannel;
    }
    let res = (1 > 3) ? "is greater" : "is less than";
    let build_state = !nightly ? "build" : "nightly";
    let experimental_state = !experimental ? "disabled" : "enabled";

    console.log("zyapbot running version " + build_state + " with experimental features " + experimental_state);


    client.user.setActivity("you", { type: 'WATCHING' });
});

client.on("messageDelete", message => {
    if (!message.partial) {
        if (logsChannel) {
            //client.channels.cache.get(logsChannel).send(message.author.tag + " deleted " + message.content + " at " + message.channel.name + " channel");
            log(message.author.tag + ` deleted message "` + message.content + `" at "` + message.channel.name + `" channel`, "DELETION");
        }
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    //if (!interaction.isCommand()) return;

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);
        const pingEmbed = {
            "type": "rich",
            "title": `Pong! 🏓`,
            "description": "",
            "color": 0x00FFFF,
            "fields": [
                {
                    "name": `Latency`,
                    "value": `${timeTaken}ms`,
                    "inline": true
                },
                {
                    "name": `API Latency`,
                    "value": `${apiLatency}ms`,
                    "inline": true
                }
            ],
            "footer": {
                "text": `Made by zyapguy and sarp.`
            }
        }
        //message.channel.send(`Pong! This message had a latency of ${timeTaken}ms.`);
        //message.channel.send(`Pong! The bot's latency to the API is ${apiLatency}ms.`)
        message.channel.send({ embeds: [pingEmbed] });
        //message.reply(`Ping command is deprecated!`);
    }

    // TODO : Add checkpermissions
    if (command === "log") {
        let toLog = "";
        for (let i = 1; i < message.content.split(" ").length; i++) {
            toLog += message.content.split(" ")[i] + " ";
        }
        log(toLog, "LOG");
    }

    /* Purge(purge)
    // The purge command deletes the amount of 
    // messages you specify where you run the command.
    // Written by : sarp and zyapguy*/
    if (command === "purge") {
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            const member = message;
            //clampToRole(member, 100)
            const amount = message.content.split(" ")[1];

            if (!amount || amount == "all") {
                message.reply(`Please write the amount you want to purge.`);
                return;
            }
            message.channel.bulkDelete(clampToRole(message, amount))
                .then(messages => message.channel.send(`Bulk deleted ${messages.size} messages.`))
                .then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                })
                .catch()
            log("<@" + message.author.id + ">" + "has purged " + clampToRole(message, amount) + " messages", "PURGE");
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }

    }


    /* Ban(ban)
    // If you have the permission to use the ban command, 
    // you can ban the person you want from the server. 
    // (Information goes to the banned person.)
    // Written by : sarp */
    if (command === "ban") {
        const { member, mentions } = message;
        const target = mentions.users.first();
        const memberThatIsGoingToBeBannedTag = `<@${target.id}>`;

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy"])) {

            let reason = message.content.slice(1);
            let reasonWithoutID = reason.slice(27);

            if (!target) return message.channel.send("<@" + message.author.id + ">" + `, please specify someone to ban.`);

            const targetMember = message.guild.members.cache.get(target.id);

            if (!reason) reason = 'Unspecified';

            const embed = new MessageEmbed().setTitle("Banned!").setColor('#ff0000').setDescription(`You have been banned from zyapguy's server for ${reasonWithoutID}.`)

            targetMember.send({ embeds: [embed] })
                .then(() => {
                    targetMember.ban({ reason: `${reason}` })
                        .then(() => {
                            message.channel.send(`${targetMember} has been banned for "${reasonWithoutID}" successfully.`);
                            log(memberThatIsGoingToBeBannedTag + " has been banned by " + "<@" + message.author.id + ">" + " for " + reasonWithoutID, "BAN");
                        })
                        .catch(() => {
                            message.channel.send(`An unexpected error has occured. Please notify ${sarpSupportTag} and ${zyapSupportTag} about this.`);
                        })
                })
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "settings") {
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy"])) {
            if (message.content.split(" ")[1] == "log_on") {
                message.channel.send("<@" + message.author.id + ">" + `, The bot will now log things`);
                doLogging = true;
            }
            else if (message.content.split(" ")[1] == "log_off") {
                message.channel.send("<@" + message.author.id + ">" + `, The bot will NOT log things`);
                doLogging = false;
            }
            else {
                message.channel.send("<@" + message.author.id + ">" + `, that is not a setting! Check docs!`);
            }
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    /* Silent/Ghost Ban(silentban)
    // If you have the permission to use the ban command, 
    // you can ban the person you want from the server. 
    // No information goes to anyone including the banned person.
    // Written by : sarp */
    if (command === "silentban") {
        const { member, mentions } = message;


        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy"])) {
            const target = mentions.users.first();
            const memberThatIsGoingToBeSilentBannedTag = `<@${target.id}>`;
            let reason = message.content.slice(1);
            let reasonWithoutID = reason.slice(33);

            const targetMember = message.guild.members.cache.get(target.id);

            if (!reason) reason = 'Unspecified';

            targetMember.ban({ reason: `${reason}` })

                .then(() => {
                    log(memberThatIsGoingToBeSilentBannedTag + " has been **SILENTLY** banned by " + "<@" + message.author.id + ">" + " for " + reasonWithoutID, "SILENT BAN");
                })
                .then(msg => {
                    setTimeout(() => message.channel.bulkDelete(1), 200)
                })
        }
        else {
            message.channel.bulkDelete(1)
                .then(() => {
                    message.channel.send(`That command does not exist.`);
                    setTimeout(() => message.channel.bulkDelete(1), 2000);
                })
        }
    }

    /* Unban(unban)
    // If you have the permission to unban, 
    // you can unban the person you want.
    // Written by : sarp */
    // -----------------------------
    // !! IMPORTANT NOTE !!
    // You need to write the ID of the banned person,
    // If you just @ the user that was banned
    // THE BOT WILL CRASH!
    // ----------------------------- 
    if (command === "unban") {
        const { member, mentions } = message;

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            const memberThatIsGoingToBeUnbanned = message.content.split(" ")[1];
            const memberThatIsGoingToBeUnbannedTag = `<@${memberThatIsGoingToBeUnbanned}>`;

            message.guild.members.unban(memberThatIsGoingToBeUnbanned)

                .then(() => {
                    message.channel.send(`${memberThatIsGoingToBeUnbannedTag} has been unbanned successfully.`);
                    log(memberThatIsGoingToBeUnbannedTag + " has been unbanned by " + "<@" + message.author.id + ">" + " for NO_REASON_SPECIFIED", "UNBAN");
                })

                .catch(() => {
                    message.channel.send(`An unexpected error has occured. Please notify ${sarpSupportTag} and ${zyapSupportTag} about this.`);
                })

            if (memberThatIsGoingToBeUnbanned.length < 18 || memberThatIsGoingToBeUnbanned.length > 18) {
                message.channel.send("<@" + message.author.id + ">" + `, please specify someone to ban using their id or the command won't work.`);
            }
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    /* Kick(kick)
    // If you have the permission to kick people, 
    // you can kick the person you want from the server.
    // Written by : sarp */
    if (command === "kick") {
        const { member, mentions } = message;
        const target = mentions.users.first();
        const memberThatIsGoingToBeKickedTag = `<@${target}>`;

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {

            const targetMember = message.guild.members.cache.get(target.id);

            if (!target) return message.channel.send("<@" + message.author.id + ">" + `, please specify someone to kick.`);

            const embed = new MessageEmbed().setTitle("Kicked!").setColor('#ff0000').setDescription(`You have been kicked from zyapguy's server.`)

            targetMember.send({ embeds: [embed] })
                .then(() => {
                    targetMember.kick()
                        .then(() => {
                            message.channel.send(`${targetMember} has been kicked successfully.`);
                            log(memberThatIsGoingToBeKickedTag + " has been kicked by " + "<@" + message.author.id + ">", "KICK");
                        })
                        .catch(() => {
                            message.channel.send(`An unexpected error has occured. Please notify ${sarpSupportTag} and ${zyapSupportTag} about this.`);
                        })
                })
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }


    /* Poll(poll)
    // If you have the permission to poll, 
    // you can make a poll using this command.
    // Written by : sarp */
    if (command === "poll") {
        const member = message;
        var body = commandBody.replace(command, '');
        var splittedBody = body.split(',');

        let pollTitle = splittedBody[0];
        let answer1 = splittedBody[1];
        let answer2 = splittedBody[2];

        let embedPoll = new MessageEmbed()
            .setTitle('📝 Poll - ' + pollTitle)
            .setDescription("✅" + answer1 + " / " + "❌" + answer2)
            .setColor('YELLOW')
            .setFooter("Poll starter: " + message.author.tag)

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "Helper", "CmMod"])) {
            message.channel.bulkDelete(1)
                .then(async () => {
                    let msgEmbed = await message.channel.send({ embeds: [embedPoll] });
                    await msgEmbed.react('✅');
                    await msgEmbed.react('❌');
                });

            //let msgEmbed = await message.channel.send({embeds: [embedPoll]});
            //await msgEmbed.react('✅');
            //await msgEmbed.react('❌');
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "say") {
        const member = message;
        var body = commandBody.replace(command + ' ', '');

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            message.channel.bulkDelete(1)
                .then(() => {
                    message.channel.send(body)
                        .then(() => {
                            log("<@" + message.author.id + ">" + " sent: '" + body + "' using the say command", "SAY");
                        });
                });
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "stg") {
        var body = commandBody.replace(command + ' ', '');
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            client.channels.cache.get('867441128725807105').send(body);
        }
    }

    /*
    if (command === "help")
    {
        const helpEmbed = {
        "title": `🤖 - Bot Help`,
        "description": "Prefix: `$`",
        "color": 0x00FFFF,
        "fields": [
            {
                "name": `Ping`,
                "value": `You can use the ping command to see the delay between your message and the bot.\nUsage example: \`$ping\``
            },
            {
                "name": `Purge`,
                "value": `Community moderators and higher users can use the purge command to bulk delete messages that the command ran at.\nUsage example: \`$purge (amount)\``
            },
            {
                "name": `Socials`,
                "value": `*not implemented yet*\nYou can use the socials command to see the social media accounts of zyapguy.\nUsage example: \`$socials\``
            },
            {
                "name": `Poll`,
                "value": `You can use the poll command to make a new poll with 2 answers if you are a helper or hirgher.\nUsage example: \`$poll your question, answer 1, answer 2\``
            },
            {
                "name": `Say`,
                "value": `*not implemented yet*`
            },
            {
                "name": `Kick`,
                "value": `You can use the kick command to kick users from the server if you are a community moderator or higher.\nUsage example: \`$kick @user\``
            },
            {
                "name": `Ban`,
                "value": `You can use the ban command to ban users from the server if you are a moderator or higher.\nUsage example: \`$ban @user (reason)\``
            },
            {
                "name": `Unban`,
                "value": `You can use the unban command to unban users that were banned before if you are a moderator or higher.\nUsage example: \`$unban userid\`\n **IF YOU PING THE USER INSTEAD OF WRITING THE USER ID, THE BOT WILL CRASH!**`
            }
            ],
            "footer": {
                "text": `Made by Beriff#3224, zyapguy#0320 and sarp#2063`
            }
        };
        message.channel.send({embeds: [helpEmbed]});
    }
    */

    if (command === "help") {
        const embed1 = new MessageEmbed()
            .setTitle('🤖 - Bot Help')
            .setDescription('Prefix: `$`')
            .setColor(0x00FFFF)
            .setFields(
                {
                    "name": `Ping`,
                    "value": `You can use the ping command to see the delay between your message and the bot.\nUsage example: \`$ping\``
                },
                {
                    "name": `Purge`,
                    "value": `Community moderators and higher users can use the purge command to bulk delete messages that the command ran at.\nUsage example: \`$purge (amount)\``
                },
                {
                    "name": `Socials`,
                    "value": `*not implemented yet*\nYou can use the socials command to see the social media accounts of zyapguy.\nUsage example: \`$socials\``
                },
                {
                    "name": `Poll`,
                    "value": `You can use the poll command to make a new poll with 2 answers if you are a helper or hirgher.\nUsage example: \`$poll your question, answer 1, answer 2\``
                },
                {
                    "name": `Say`,
                    "value": `*not implemented yet*`
                }
            );


        const embed2 = new MessageEmbed()
            .setTitle('🤖 - Bot Help')
            .setDescription('Prefix: `$`')
            .setColor(0x00FFFF)
            .setFields(
                {
                    "name": `Kick`,
                    "value": `You can use the kick command to kick users from the server if you are a community moderator or higher.\nUsage example: \`$kick @user\``
                },
                {
                    "name": `Ban`,
                    "value": `You can use the ban command to ban users from the server if you are a moderator or higher.\nUsage example: \`$ban @user (reason)\``
                },
                {
                    "name": `Unban`,
                    "value": `You can use the unban command to unban users that were banned before if you are a moderator or higher.\nUsage example: \`$unban userid\`\n **IF YOU PING THE USER INSTEAD OF WRITING THE USER ID, THE BOT WILL CRASH!**`
                },
            )
            .setFooter('Made by Beriff, Sarp and Zyapguy');

        const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Previous')
            .setStyle('DANGER');

        const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Next')
            .setStyle('SUCCESS');

        const pages = [
            embed1,
            embed2,
        ];

        const buttonList = [
            button1,
            button2
        ]

        paginationEmbed(message, pages, buttonList, 12000);
    }

    /* Add Role(addrole)
    // If you have the permission to use the addrole command, 
    // you can add a role to any person on the server. 
    // Written by : sarp */
    if (command === "addrole") {
        const { mentions, guild } = message;
        const target = message.mentions.members.first();
        let roleContent = message.content.slice(32);

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            const targetMember = message.guild.members.cache.get(target.id);
            let role = message.guild.roles.cache.find(r => r.name === roleContent);
            target.roles.add(role)
                .then(() => {
                    message.channel.send(`The role has been given to ${targetMember} successfully.`);
                })
                .catch(() => {
                    message.channel.send(`Are you sure that you wrote the user or the role right?`);
                });
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    /* Remove Role(removerole)
    // If you have the permission to use the removerole command, 
    // you can remove a role from any person except zyapguy. 
    // Written by : sarp */
    if (command === "removerole") {
        const { mentions, guild } = message;
        const target = message.mentions.members.first();
        let roleContent = message.content.slice(35);

        if (target == '291592918592913408' || target == '356881136984522763') return message.channel.send("nope, not gonna do that.");

        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            const targetMember = message.guild.members.cache.get(target.id);
            let role = message.guild.roles.cache.find(r => r.name === roleContent);
            target.roles.remove(role)
                .then(() => {
                    message.channel.send(`The role has been removed from ${targetMember} successfully.`);
                })
                .catch(() => {
                    message.channel.send(`Are you sure that you wrote the user or the role right?`);
                });
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "poop") {
        message.channel.bulkDelete(1)
            .then(() => {
                message.channel.send('💩');
            });
    }

    if (command === "userinfo") {
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            const target = message.mentions.users.first();
            let target1 = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

            const embed = new Discord.MessageEmbed()
                .setColor('#FFD700')
                .setTitle(`Info for ${target.tag}`)
                .setDescription(`
                    Account Created At: ${target.createdAt.toLocaleString()}
                    Account Joined At: ${target1.joinedAt.toLocaleString()}
                `)
                .setImage(target.displayAvatarURL())
            message.channel.send({ embeds: [embed] })
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "countdown") {
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy", "CmMod"])) {
            // best if statement ever that is totally needed
            if (!Number.isInteger(parseInt(args[0]))) return message.channel.send("31?")

            let secondsleft = parseInt(args[0]) + 1

            const countdownMessage = message.channel.send("Starting countdown!")

            const countdown = setInterval(() => {
                if (secondsleft <= 1) {
                    clearInterval(countdown);
                    countdownMessage.then(m => { m.edit("Countdown done!") })
                } else {
                    countdownMessage.then(m => { m.edit(secondsleft.toString()) })
                }
                secondsleft -= 1;
            }, 1000);
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }

    if (command === "shutdown") {
        let confirmContent = message.content.slice(10);
        console.log(confirmContent);

        // Removed community mod
        if (checkPermissions(message, ["Mod", "SrMod", "Admin", "zyapguy"])) {
            if (confirmContent == "yes") {
                message.channel.send("Shutting down...").then(() => {
                    client.destroy();
                });
            }
            else {
                message.channel.send("Write `$shutdown yes` to confirm the shutdown of the bot.");
            }
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + `, you don't have the right permissions to use this command.`);
        }
    }
});

client.login(token);