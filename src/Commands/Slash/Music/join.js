const { SlashCommandBuilder } = require("@discordjs/builders");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("join").setDescription("Me uno al canal de voz"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);
    if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Ando ocupado en otra partes"})

    let channelVoice = interaction.member.voice.channel;

    client.distube.voices.join(channelVoice)
  },
};
