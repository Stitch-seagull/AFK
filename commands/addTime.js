const parse = require("parse-duration")
const humanize = require("humanize-duration")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { afkCollection } = require("../collections/afkCollection");

module.exports = {
    data : new SlashCommandBuilder()
        .setName("addtime")
        .setDescription("Add time to your AFK's duration")
        .addStringOption((option) => option.setName("time").setDescription("The time you want to add to your AFK's duration").setRequired(true)),
    async execute(interaction){

        const data = afkCollection.get(interaction.user.id)
        const timeOption = interaction.options.getString("time")

        if(data === undefined){
            let everAFK = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("\\💤 You'r not already AFK ")
                .setColor("ffca2c")
            return interaction.reply({embeds : [everAFK], ephemeral : true})
        }

        else if(parse(timeOption) === null){
            let notCorrectDuration = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("__How to write duration :__ \n\n `h` → hours \n `m` → minutes \n\n Example : `3h 7m`")
                .setColor("ffca2c")
            return interaction.reply({embeds : [notCorrectDuration], ephemeral : true})
        }

        else if(parse(timeOption) < 60000){
            let tooShortDuration = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("\\⌛ The added duration must be more than `1 minute` ")
                .setColor("ffca2c")
            return interaction.reply({embeds : [tooShortDuration], ephemeral : true})
        }

        else if(data[0] + parse(timeOption) - (Date.now() - data[1]) > 36000000 || data[0] + parse(timeOption) - (Date.now() - data[1]) < 300000){
            let tooLongDuration = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription(`\\⌛ The total duration remaining must be between \`5 minutes\` and \`10 hours\` \n Current duration remaining : \`${humanize(data[0] - (Date.now() - data[1]))}\``)
                .setColor("ffca2c")
            return interaction.reply({embeds : [tooLongDuration], ephemeral : true})
        } else {
            afkCollection.set(interaction.user.id, [data[0] + timeOption, data[1],data[2]])
            let succefulyAdded = new MessageEmbed()
                .setDescription(`\\⏳ Suceffuly added \`${humanize(parse(timeOption))}\`  \n \\💤 New duration remaining : \`${humanize(data[0] + parse(timeOption) - (Date.now() - data[1]))}\``)
                .setColor("#195286")
            return interaction.reply({embeds : [succefulyAdded]})
        }
    }
}