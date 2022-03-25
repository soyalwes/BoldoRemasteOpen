const { SlashCommandBuilder } = require("@discordjs/builders");
const color = require("../../../json/Color.json")
const Permissions = require("../../../json/Permissions.json");
const { Message } = require("../../../json/ErrorMessage.json");
const { MessageEmbed } = require("discord.js");


let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Limpia cierta cantidad de mensajes")
    .addNumberOption((option) =>
      option
        .setName("messages")
        .setDescription("Escribe la cantidad de mensajes a borra")
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

    let message = interaction.options.getNumber("messages")

    let permsBot = interaction.guild.me.permissions.has(Permissions.MM.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot} \nPermiso: ${Permissions.MM.MessagePerms}`,
      });

    let perms = interaction.member.permissions.has(Permissions.MM.Perm);
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions} \nPermiso: ${Permissions.MM.MessagePerms}`,
      });

      if(message > 100)return interaction.reply({content:"No puedes borrar mas de 100 mensajes"})

      try{
          interaction.channel.bulkDelete(message)

          const clearEmbed = new MessageEmbed()
          .setTitle("🧹|Clear")
          .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
          .addField("Cantidad", `${message}`)
          .addField("Canal", `${interaction.channel}`)
          .addField("Tiempo", `<t:${Math.floor(Date.now() / 1000)}>`)
          .setColor(color.DangerColor)

          setTimeout(() => {
            interaction.reply({embeds:[clearEmbed]})
          }, 1500)
      } catch (e) {
          console.log(e)

          interaction.reply({content: Message})
      }
  },
};
