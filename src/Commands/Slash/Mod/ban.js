const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const { Message } = require("../../../json/ErrorMessage")
const Permissions = require("../../../json/Permissions.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona el usuario a banear")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Describe la razon del ban")
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
    const user = interaction.options.getMember("user");

    const reason = interaction.options.getString("reason") || "No hay una razon";

    const permsBot = interaction.guild.me.permissions.has(Permissions.BM.Perm)
    if(!permsBot)return interaction.reply({content:`${Permissions.MessageNoPermissions}\nPermisos: ${Permissions.BM.MessagePerms}`})

    const perms = interaction.member.permissions.has(Permissions.BM.Perm)
    if(!perms)return interaction.reply({content:`${Permissions.MessageNoPermissionsBot}\nPermisos: ${Permissions.BM.MessagePerms}`})

    if(user === interaction.member)return interaction.reply({content:"No puedes banearte a ti mismo"})

    if(user === client.member)return interaction.reply({content:"No puedes banearme por seguridad"})

    if(user.id === interaction.guild.ownerId)return interaction.reply({content:"No puedes banear al owner del server"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes banear a alguien por encima o igual a ti"})

    if(!user.banneable)return interaction.reply({content:"No puedo banear a ese usuario"})

    try{
      interaction.guild.members.ban(user.id, {reason: reason})

      interaction.guild.bans.fetch().then(ban => {
        let size = ban.size
        const banEmbed = new MessageEmbed()
        .setTitle("👮‍♂️|Miembro baneado")
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
        .addField("Autor", `${interaction.user.tag}`, true)
        .addField("Baneado", `${user.user.tag}`, true)
        .addField("Razon", `${reason}`, true)
        .setFooter({ text: `Baneados totales: ${size}\n<t:${Math.floor(Date.now() / 1000)}:>`})
        .setColor("RED")

        interaction.reply({embeds:[banEmbed]})

      })
    } catch (e) {
      console.log(e)

      return interaction.reply({content: Message})
    }
  },
};
