const { MessageEmbed} = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data : new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all bot's features"),
    async execute(interaction){
        let aboutEmbed = new MessageEmbed()
            .setDescription(`
            ❓ **__How it works ?__**

            1 - Set your AFK
2 - When a user mention you, AFK sends him a message about your AFK
3 - Then you avoid pings because the user knows you are AFK
            
            🔧 **__To set your AFK__**
             → \`/setAfk\`
            
            ⌛ **__To add time :__**
             → \`/addTime \`
              
            🗑️ **__To delete your AFK :__**
             → \`/deleteAfk\` 
             
            📡 **__When your AFK ends, you will receive a DM__**
             → \`Then do not block your DM\`
             
            💖 **__How to invite the bot__** 
             → [Click Here](https://discord.com/api/oauth2/authorize?client_id=906218866898780170&permissions=274878024704&scope=bot%20applications.commands)
             
            🗳️ **__Vote for the bot__**  
             → [Click Here](https://top.gg/bot/906218866898780170/vote) 
             
            💡 **__Support Server :__** 
            → Follow annoucements
            → Reports bugs
            → [Click Here](https://discord.gg/k8DFQpxvWE)
            `)
            .setColor('#195286')
        interaction.reply({embeds : [aboutEmbed]})
    }
}