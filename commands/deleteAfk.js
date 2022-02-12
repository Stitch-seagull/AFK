const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders');
const { afkCollection } = require("../collections/afkCollection");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('deleteafk')
        .setDescription('Delete your AFK'),
    async execute(interaction){
        if(afkCollection.get(interaction.user.id) === undefined){
            let everAFK = new MessageEmbed()
                .setDescription("\\💤 You'r not already AFK")
                .setColor("ffca2c")
            return interaction.reply({embeds : [everAFK], ephemeral : true})
        } else {
            afkCollection.delete(interaction.user.id)
            let deletedAFK = new MessageEmbed()
                .setDescription("🗑️ Correctly delete your AFK !")
                .setColor("#195286")
            interaction.reply({embeds : [deletedAFK]})
        }
    }
}