const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("now-playing").setDescription("Ve lo que estoy reproduciendo ahora mismo"),

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

    const nowSong = queue.songs[0];

    const NowPlayingEmbed = new MessageEmbed()
    .setTitle("☑|NowPlaying")
    .setThumbnail(nowSong.thumbnail)
    .addField("Musica", `${nowSong.name}`)
    .addField("URL", `${nowSong.url}`)
    .addField("Tiempo", `${queue.currentTime}`)
    .addField("Duracion", `${nowSong.formattedDuration}`)
    .addField("Volumen", `${queue.volume}`)
    .addField("Filtros", `${queue.filter || "No hay filtros"}`)
    .addField("AutoPlay", `${queue.autoplay ? "On" : "Off"}`)
    .setColor(color.BotColor)

    interaction.reply({embeds:[NowPlayingEmbed]})
  },
};