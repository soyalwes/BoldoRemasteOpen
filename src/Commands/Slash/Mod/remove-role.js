const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json");
const { Message } = require("../../../json/ErrorMessage.json") 

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-role")
    .setDescription("Remueve un rol a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Selleciona el rol a quitar")
        .setRequired(true)
    ),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);
    const user = interaction.options.getMember("user")

    const role = interaction.options.getRole("role")

    let permsBot = interaction.guild.me.permissions.has(Permissions.MG.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.MG.Perm}`,
      });

    let perms = interaction.member.permissions.has(Permissions.MG.Perm);
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.MG}`,
      });

      if(user === interaction.member)return interaction.reply({content:"No puedes quitarte roles a ti mismo"})

      if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes quitar el rol a alguien por encima de ti"})

      if(!role.editable) return interaction.reply({content:"No puedo quitar este rol"})

      if(role.permissions.has("ADMINISTRATOR")) return interaction.relpy({content:"No puedo quitar ese rol tiene administrador"})

      try{
          await user.roles.remove(role)

          const roleRemoEmbed = new MessageEmbed()
          .setTitle("❌|Rol removido")
          .addField("Usuario", `${user}`)
          .addField("Autor", `${interaction.user}`)
          .addField("Rol", `${role.name}`)
          .setColor(color.DangerColor)
          .setTimestamp()

          interaction.reply({embeds:[roleRemoEmbed]})
      } catch (e) {
          console.log(e)
  
        interaction.reply({content: Message });
      }
  },
};