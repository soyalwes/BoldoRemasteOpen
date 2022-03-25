const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json")

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ve mi ping"),

  async run(client, interaction) {
    
    interaction.channel.send({ content: "Midiendo ping" }).then((msg) => {

      let pingBot = Date.now() - msg.createdTimestamp;

      let ping = Math.floor(client.ws.ping);

      let pingApi;

      let PingBotNow;

      if(pingBot > 0) PingBotNow = `⚪|Bot ping: ${pingBot}`

      if(pingBot > 100) PingBotNow = `🟢|Bot ping ${pingBot}`

      if(pingBot > 200) PingBotNow = `🟠|Bot ping ${pingBot}`

      if(pingBot > 300) PingBotNow = `🔴|Bot ping ${pingBot}`

      if(ping > 0) pingApi = `⚪|Discord api ${ping}`

      if(ping > 100) pingApi = `🟢|Discord api ${ping}`

      if(ping > 200) pingApi = `🟠|Discord api ${ping}`

      if(ping > 300) pingApi = `🔴|Discord api ${ping}`

      const embedPing = new MessageEmbed()
      .setTitle("🏓 Pong...")
      .setDescription(`${pingApi}\n${PingBotNow}`)
      .setColor(color.BotColor)

      interaction.reply({embeds:[embedPing]})
    })
  },
};
