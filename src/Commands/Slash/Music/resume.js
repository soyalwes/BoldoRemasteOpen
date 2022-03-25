const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message } = require("../../../json/ErrorMessage.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Pon la musica de nuevo"),

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

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})

    const queue = client.distube.getQueue(interaction.member.voice.channel)

    if(!queue)return interaction.reply({content:"No hay canciones reproduciendose"})

    if(!queue.pause)return interaction.reply({content:"La cancion no esta pausada"})


    if(queue.pause){
      queue.resume(interaction.member.voice.channel)
      interaction.reply({content:"▶|Reproduciendo la cancion"})
    } else {
      interaction.reply({content: Message })
    }
  },
};