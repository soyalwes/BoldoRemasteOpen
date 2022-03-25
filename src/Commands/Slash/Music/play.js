const { SlashCommandBuilder } = require("@discordjs/builders");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Pon musica mientras estas en llamada")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Escribe la musica que quieres escuchar")
        .setRequired(true)
    ),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const song = interaction.options.getString("song")

    if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Debes estar en el mismo canal de voz que yo"})

    interaction.client.distube.play(
      interaction.member.voice.channel,
      song,
      {
        textChannel: interaction.channel,
        member: interaction.member
      }
    )

    interaction.reply({content:"Buscando cancion"})
  },
};
