const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("queue").setDescription("Ve la musica que se estan reproduciendo"),

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

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Debes estar en el mismo canal de voz que yo"})

    const queue = client.distube.getQueue(interaction.member.voice.channel);

    if(!queue)return interaction.reply({content:"No hay canciones en la queue"})

    const queueEmbed = new MessageEmbed()
    .setTitle("Queue")
    .setDescription("\n" + queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n"))
    .setColor("BLUE")

    interaction.reply({embeds:[queueEmbed]})
  },
};