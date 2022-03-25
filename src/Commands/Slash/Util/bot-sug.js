const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("bot-sug").setDescription("Haz una sugerencia para este bot").addStringOption(option => option.setName("sug").setDescription("Di la sugerencias").setRequired(true)),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let sug = interaction.options.getString("sug")

    const sugEmbed = new MessageEmbed()
    .setAuthor({ name: `Sugerencia de ${interaction.user.tag}`, iconURL: `${interaction.member.displayAvatarURL()}`})
    .setDescription(sug)
    .setColor(color.BotColor)
    .setTimestamp()

    client.channels.cache.get("948603264901984317").send({embeds:[sugEmbed]}).then((m) => {
      m.react("👍")
      m.react("👎")
    })

    interaction.reply({content: "Gracias por la sugerencia", ephemeral: true})
  },
};