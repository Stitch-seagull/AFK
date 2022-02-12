const fs = require('fs')
const express = require("express")
const TopGG = require("@top-gg/sdk")
const parse = require("parse-duration")
const humanize = require("humanize-duration")

const { token } = require('./config.json')
const { Client, Collection, Intents, Message } = require('discord.js')
const { afkCollection }= require("./collections/afkCollection")
const { MessageEmbed } = require('discord.js')
const { match } = require('assert')


const client = new Client({ intents: Object.keys(Intents.FLAGS), partials : ["USER", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE"]})

//READY
client.once('ready', () => {
	console.log("Ready")

    setInterval(function(){
        afkCollection.forEach((V,K)=> {
            if(Date.now() - V[1] > V[0]){
                let deletedAFK = new Discord.MessageEmbed()
                    .setDescription(`Your AFK has recently ended`)
                    .setColor("#195286")
                client.users.cache.get(K).send({embeds : [deletedAFK]}).catch(error)
                afkCollection.delete(K)
            }
        })
    },60000)

    setInterval(function(){
        const presences = [
            `${afkCollection.size} AFKs 💤`,
            `${client.users.cache.size} Users 😀`,
            `${client.guilds.cache.size} servers 🌇`
        ]
        client.user.setPresence({activities : [{name : `${presences[Math.floor(Math.random()* presences.length)]}`, type : "WATCHING"}], status : "idle" })
    },5000)
});


//API top.gg
const app = express()
const webhook = new TopGG.Webhook('afK')

app.post('/dblwebhook', webhook.listener(vote => {
    let voteEmbed = new Discord.MessageEmbed()
        .setDescription(`Thanks you <@${vote.user}> for voting for <@${vote.bot}> ❤️ \n You now have the <@&919670839065059339> role for next 12 hours 🗳️`)
        .setColor('#195286')
    client.channels.cache.get("919655076115669032").send({embeds : [voteEmbed]})
    client.guilds.cache.get("906219152220491887").members.cache.get(vote.user).roles.add("919670839065059339").catch(error) // Ajoute le rôle Voteur 
    setTimeout(function(){client.guilds.cache.get("906219152220491887").members.cache.get(vote.user).roles.remove('919670839065059339').catch(Error)},43200000) // Retire le rôle voteur après 12 heures
}))

app.listen("20059")

// FICHIERS POUR HANDLER
client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.data.name, command)
}

//HANDLER
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	const command = client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		return interaction.reply({ content: '⚠️ There was an error while executing this command! \n 🐛 You could report bugs here : https://discord.gg/k8DFQpxvWE', ephemeral: true })
	}
});

//SYSTEME D'AFK
client.on('messageCreate', message => {
	// RETURNS
	if (message.type !== 'DEFAULT' || message.author.bot) return
    if (message.channel.type === 'dm') return

	message.mentions.members.filter(i => afkCollection.has(i.id)).forEach(member => {
		let data = afkCollection.get(member.id)
		let afkMember = new MessageEmbed()
			.setDescription(`\\💤 ${member.user} is actually AFK \n \\⌛ Time left :  \`${humanize(Math.round(Date.now() - (data[0] + data[1])))}\` \n \\❓ Reason : \`${data[2]}\` `)
			.setColor("#195286")
		message.reply({embeds : [afkMember]}).then(msg => {
			setTimeout(function(){msg.delete()}, 5000)
		}).catch(error => {
		message.author.send({embeds : [afkMember]}).catch(error)
		})
	})
})

// GHOSTPING

client.on("messageDelete" , message => {
    if(message.channel.type === "DM"){
        return
    }

    message.mentions.members.forEach(m => {

        function replacer(match){
            return `@${client.users.cache.get(match.match(/[0-9]+/g)[0]).tag}`
        }

        let ghostEmbed = new MessageEmbed()
            .setDescription(`\\👻 **__Ghost Ping__** 
            
            😣 Message Author : \`${message.author.tag}\`
            📜 Message Content : \`\`\`${message.content.trim().replace(/<(?:@[!&]?|#)\d+>/g, replacer)}\`\`\`
            `)
            .setFooter(`Sent in ${message.channel.name} of ${message.guild.name}`)
        m.send({embeds : [ghostEmbed]}).catch(error => console.log(error))
    })
})

// LOGS WHEN NEW SERVER

client.on('guildCreate', guild => {
    let newServer = new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setDescription(`Crée il y a : \`${humanize(Date.now() - guild.createdAt)}\` \n Membres : \`${guild.members.cache.size}\``)
        .setColor("#195286")
    client.channels.cache.get("910234054723522561").send({embeds : [newServer]})
})

//Login
client.login(token)
