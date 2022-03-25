const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-error")
    .setDescription("Reporta errores del bot")
    .addStringOption((option) =>
      option
      .setName("error")
      .setDescription("Di el error")
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
    let error = interaction.options.getString("error")

    const embedError = new MessageEmbed()
    .setTitle("❌|Report Error")
    .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username})
    .setDescription(`Nuevo error: ${error}`)
    .setColor(color.DangerColor)
    .setTimestamp()

    interaction.reply({content:"Gracias por enviar el error", ephemeral: true})

    client.channels.cache.get("944354348597653524").send({embeds:[embedError]})
  },
};
