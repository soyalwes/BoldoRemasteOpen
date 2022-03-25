const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jumbo")
    .setDescription("Ve un emoji en grande")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Pon el nombre del emoji")
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

    const emojiName = interaction.options.getString("name")

    let emoji = interaction.guild.emojis.cache.find(e => e.name === emojiName)

    if(!emoji)return interaction.reply({content:"Pon nombre de un emoji"})

    const embedEmoji = new MessageEmbed()
    .setTitle(emojiName)
    .setDescription(`[Link](${emoji.url})`)
    .setImage(emoji.url)
    .setColor(color.BotColor)

    interaction.reply({embeds:[embedEmoji]})
  },
};
