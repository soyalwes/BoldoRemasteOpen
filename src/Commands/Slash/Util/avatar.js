const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Ve tu avatar o de otras personas")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elije al usuario")
        .setRequired(false)
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

    const user = interaction.options.getMember("user") || interaction.member;

    if(user === interaction.member){
      const embedAvatarYou = new MessageEmbed()
      .setTitle(`Tu avatar`)
      .setDescription(`[Link](${user.displayAvatarURL({
        size: 2048,
        dynamic: true,
      })})`)
      .setImage(user.displayAvatarURL({size: 2048, dynamic: true}))
      .setColor("RANDOM")

      interaction.reply({embeds:[embedAvatarYou]})
    } else {
      const embedAvatar = new MessageEmbed()
      .setTitle(`Avatar de ${user.user.tag}`)
      .setDescription(`[Link](${user.displayAvatarURL({
          size: 2048,
          dynamic: true,
      })})`)
      .setImage(user.displayAvatarURL({size: 2048, dynamic: true}))
      .setColor("RANDOM")
      .setFooter({ text: `Pedido por ${interaction.user.tag}`});

      interaction.reply({embeds:[embedAvatar]})
    }
  },
};
