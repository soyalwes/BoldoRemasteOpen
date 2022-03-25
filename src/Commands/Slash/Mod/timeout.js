const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message } = require("../../../json/ErrorMessage.json");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json");
const Permissions = require("../../../json/Permissions.json");
const ms = require("ms");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Da un timeout a alguien")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("seconds")
        .setDescription("Di los segundos que durara el timeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon del tiemot")
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

    let user = interaction.options.getMember("user")

    let seconds = interaction.options.getNumber("seconds")

    let reason = interaction.options.getString("reason") || "No hay una razon"

    if(seconds.length > 8)return interaction.reply({content:"No puedes poner mas de 8 caracteres"})

    let timeOnSeconds = `${seconds}s`

    let time = ms(timeOnSeconds)

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

      if(user === interaction.member)return interaction.reply({content:"No puedes darte un timeout a ti mismo"})

      if(user === client.member)return interaction.reply({content:"No puedes darme un timeout, temas de seguridad"})

      if(user.id === interaction.guild.ownerId)return interaction.reply({content:"No puedes darle un timeout al owner del server"})

      if(user.isComunicationDisabled())return interaction.reply({content:"Ese usuario ya tiene un timeout"})

      if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes dar un timeout a una persona que esta por encima o igual a ti"})

      try{
          user.timeout(time, reason)

          const timeoutEmbed = new MessageEmbed()
          .setTitle("🔇|Timeout")
          .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
          .setThumbnail(interaction.guild.iconURL())
          .addField("Usuario", `${user}`, true)
          .addField("Razon", `${reason}`, true)
          .addField("Tiempo", `${timeOnSeconds}`, true)
          .setFooter({ text: `Autor: ${interaction.member}`})
          .setColor(color.DangerColor)

          interaction.reply({embeds:[timeoutEmbed]})
      }catch(e){
          console.log(e)

          interaction.reply({content: Message})
      }
  },
};
