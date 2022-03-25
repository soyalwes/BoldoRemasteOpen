const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Message } = require("../../../json/ErrorMessage.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-nick")
    .setDescription("Cambia tu nick")
    .addStringOption((option) =>
      option.setName("name").setDescription("Escribe el nombre a cambiarte")
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

    let nick =
      interaction.options.getString("name") || interaction.user.username;

    try {
      interaction.member.setNickname(nick);

      const embedNick = new MessageEmbed()
        .setTitle("👦|Change nick")
        .setDescription(`${interaction.member} se a cambiado el nombre a ${nick}`)
        .setColor("GREEN");

        interaction.reply({embeds:[embedNick]})
      if (nick === interaction.user.username) {
        const embedNick2 = new MessageEmbed()
          .setTitle("👦|Change nick")
          .setDescription(`${interaction.member} ha restablecido su nickname`)
          .setColor("GREEN");

          interaction.reply({embeds:[embedNick2]})
      }
    } catch (e) {
      console.log(e);

      return interaction.reply({content: Message})
    }
  },
};
