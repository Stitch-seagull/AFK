const parse = require("parse-duration")
const humanize = require("humanize-duration")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { afkCollection }= require("../collections/afkCollection")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setafk")
		.setDescription("Set your AFK")
		.addStringOption((option) => option.setName('duration').setDescription("The duration").setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription("The reason").setRequired(true)),
	async execute(interaction){
        if(afkCollection.get(interaction.user.id) !== undefined){
            let everAFK = new MessageEmbed()
                .setDescription("\\💤 You'r already AFK")
                .setColor("ffca2c")
            return interaction.reply({embeds : [everAFK], ephemeral : true})
        } 
        
        else if(parse(interaction.options.getString("duration")) === null){
            let notCorrectDuration = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("__How to write duration :__ \n\n `h` → hours \n `m` → minutes \n\n Example : `3h 7m`")
                .setColor("ffca2c")
            return interaction.reply({embeds : [notCorrectDuration], ephemeral : true})
        } 
        
        else if(parse(interaction.options.getString("duration")) < 300000 || parse(interaction.options.getString("duration")) > 36000000 ){
            let tooLongDuration = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("\\⌛ The duration must be between `5 minutes` and `10 hours` ")
                .setColor("ffca2c")
            return interaction.reply({embeds : [tooLongDuration], ephemeral : true})
		} else {
            afkCollection.set(interaction.user.id, [parse(interaction.options.getString("duration")),Date.now(), interaction.options.getString("reason")])
            let definedAFK = new MessageEmbed()
                .setDescription(`\\🛌 You've been correctly defined AFK \n\n \\⌛ Duration : \`${humanize(parse(interaction.options.getString("duration")))}\`\n \\❓ Reason : \`${interaction.options.getString("reason")}\` `)
                .setColor("#195286")
            return interaction.reply({embeds : [definedAFK]})
        }
	},
}
