const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Message } = require("../../../json/ErrorMessage.json");
const color = require("../../../json/Color.json");
const Permissions = require("../../../json/Permissions.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
  .setName("untimeout")
  .setDescription("Quita el timeout a un usuario")
  .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
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

    let user = interaction.options.getMember("user")

    let permsBot = interaction.guild.me.permissions.has(Permissions.MMB.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.MMB.MessagePerms}`,
      });

    let perms = interaction.member.permissions.has(Permissions.MMB.Perm);
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.MMB.MessagePerms}`,
      });

      if(!user.isComunicationDisabled())return interaction.reply({content:"El usuario no tiene un timeout"})

      if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes quitar un timeout a una persona que esta por encima o igual a ti"})

      try{
        user.timeout(null)

        const userUnTimeout = new MessageEmbed()
        .setTitle("🔈|UnTimeout")
        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
        .setThumbnail(interaction.guild.iconURL())
        .addField("Usuario", `${user}`)
        .addField("Autor", `${interaction.member}`)
        .setColor(color.SuccesColor)

        interaction.reply({embeds:[userUnTimeout]})

      }catch (e){
        console.log(e)

        interaction.reply({content: Message})
      }
  },
};