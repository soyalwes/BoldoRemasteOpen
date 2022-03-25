const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-update")
    .setDescription("Pon un canal de actualizacion sobre el bot"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const updateEmbed = new MessageEmbed()
    .setTitle("🎉|Actualizacion")
    .setDescription("Notas del la version: 0.0.4 \n\n \`\`\`Bugs arreglados\nComandos de moderacion agregados:\nadd-role\nremove-role\nnuke\nBugs arreglados`\`\`\ ")
    .setColor(color.BotColor)

    interaction.reply({embeds:[updateEmbed]})
  },
};
