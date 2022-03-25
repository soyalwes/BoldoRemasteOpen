const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Message } = require("../../../json/ErrorMessage.json")
const Permissions = require("../../../json/Permissions.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona a un usuario")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon del la expulcion")
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

    const user = interaction.options.getMember("user")

    const reason = interaction.options.getString("reason")

    const permBot = interaction.guild.me.permissions.has(Permissions.KC.Perm);
    if(!permBot)return interaction.reply({content:`${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.KC.MessagePerms}`})

    const perms = interaction.member.permissions.has(Permissions.KC.Perm)
    if(!perms)return interaction.reply({content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.KC.MessagePerms}`})

    if(user === interaction.member)return interaction.reply({content:"No puedes expulsar a ti mismo"})

    if(user === client.member)return interaction.reply({content:"No me puedes expulsar por motivos de serguridad"})

    if(user.id === interaction.guild.ownerId)return interaction.reply({content:"No puedes expulsar al owner del server"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes expulsar a alguien igual o por encima de ti"})

    if(!user.kickable)return interaction.reply({content:"No puedo expulsar a este usuario"})

    try{
      interaction.guild.members.kick(user.id, {reason: reason})

      const kickEmbed = new MessageEmbed()
      .setTitle("💂‍♂️|Miembro expulsado")
      .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
      .setThumbnail(interaction.guild.iconURL())
      .addField("Autor", `${interaction.user.tag}`)
      .addField("Expulsado", `${user.user.tag}`)
      .addField("Razon", `${reason}`)
      .setFooter({ text: `<t:${Math.floor(Date.now() / 1000)}:>` })
      .setColor("RED")

      interaction.reply({embeds:[kickEmbed]})
    }catch(e){
      console.log(e)

      return interaction.reply({content: Message})
    }
  },
};
