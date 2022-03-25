const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("¿La bola 8 tendra razon?")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Di la pregunta")
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
    let question = interaction.options.getString("question")

    let answer = ["Si", "No", "¿Puede ser?", "NO", "Tal vez", "Decidelo tu", "404 Not foud", "Obio", "Obiamente no", "Definitivamente"]

    let random = answer[Math.floor(Math.random() * answer.length)]

    const eigthbalEmbed = new MessageEmbed()
    .setTitle("🎱|8ball")
    .addField("Pregunta", `${question}`)
    .addField("Respuesta", `${random}`)
    .setColor("BLUE")

    interaction.reply({embeds:[eigthbalEmbed]})
  },
};
