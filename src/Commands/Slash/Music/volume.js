const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message } = require("../../../json/ErrorMessage.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Cambia el volumen de la musica que esuchas")
    .addNumberOption((option) =>
      option
        .setName("volume")
        .setDescription("Pon el volumen que quieras que no pase 200")
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

    let volume = interaction.options.getNumber("volume");

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Tienes que estar en un canal de voz",
      });

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.reply({
        content: "Tienes que estar en el mismo canal de voz que yo",
      });

    const queue = client.distube.getQueue(interaction.member.voice.channel);

    if (!queue)
      return interaction.reply({ content: "No hay canciones reproduciendose" });

    if (volume < 1)
      return interaction.reply({ content: "El volumen debe ser mayor a 1" });
    if (volume > 200)
      return interaction.reply({ content: "El volumen debe ser menor a 200" });

    try {
      queue.setVolume(volume);

      interaction.reply({ content: `🔊|Volumen: ${volume}` });
    } catch (e) {
      console.log(e);

      interaction.reply({ content: Message});
    }
  },
};
