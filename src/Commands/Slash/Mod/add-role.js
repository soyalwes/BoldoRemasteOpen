const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json");
const { Message } = require("../../../json/ErrorMessage.json") 

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Agrega un rol")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario para darle el rol")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Seleciona el rol a dar")
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

    let user = interaction.options.getMember("user");

    let role = interaction.options.getRole("role");

    let permsBot = interaction.guild.me.permissions.has(Permissions.MR.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.MR.Perm}`,
      });

    let perms = interaction.member.permissions.has(Permissions.MR.Perm);
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.MR.Perm}`,
      });

    if (user === interaction.member)
      return interaction.reply({
        content: "No puedes agregarte roles a ti mismo",
      });

    if (
      interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0
    )
      return interaction.reply({
        content:
          "No puedes agregar roles a usuarios que estan por encima de ti",
      });

    if (role.comparePositionTo(interaction.member.roles.highest) > 0)
      return interaction.reply({
        content: "No puedes darle ese rol, esta por encima de el tuyo",
      });

    if (role.permissions.has("ADMINISTRATOR"))
      return interaction.reply({ content: "No puedo darle ese rol tiene administrador" });

    if (!role.editable)
      return interaction.reply({ content: "No puedo dar ese rol" });

      try{
      await user.roles.add(role);

      const roleEmbed = new MessageEmbed()
        .setTitle("✅|Rol agregado")
        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
        .addField("Usario", `${user}`)
        .addField("Autor", `${interaction.user}`)
        .addField("Rol", `${role.name}`)
        .setColor(color.SuccesColor)
        .setTimestamp();

      interaction.reply({ embeds: [roleEmbed] });
      } catch (e) {
          console.log(e)

          interaction.reply({content: Message})
      }
  },
};