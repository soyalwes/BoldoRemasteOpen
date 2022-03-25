const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warnSchema = require("../../../Schema/warn-schema");
const sm = require("../../../json/SuccesMessages.json");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Da una advertencia a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
        .setRequired(true)
    ).addStringOption((option) => 
        option
        .setName("reason")
        .setDescription("Di la razon de la advertencia")
        .setRequired(false)
    ).addStringOption((option) =>
      option
      .setName("evidence")
      .setDescription("Da evidencias del warn")
      .setRequired(false)),

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

    const reason = interaction.options.getString("reason") || "No hay una razon"

    const Evidence = interaction.options.getString("evidence") || "No hay evidencia"

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

      if(user === interaction.member)return interaction.reply({content:"No puedes advertirte a ti mismo"})

      if(user === client.member)return interaction.reply({content:"No puedes advertirme, por motivos de seguridad"})

      if(user.bot)return interaction.reply({content:"No puedes advertir a un bot"})

      if(user.id === interaction.guild.ownerId)return interaction.reply({content: "No puedes advertir al owner del server"})
     
      if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content: "No puedes advertir a alguien por encima de ti"})

    let datos = await warnSchema.findOne({guildId: interaction.guild.id, userId: user.id})
    if(!datos){
        let newDatos = new warnSchema({
            guildId: interaction.guild.id,
            userId: user.id,
            Content: []
        })
        await newDatos.save()

        return interaction.reply({content: sm.datosSucces})
    };

    let warnObj = {
        AuthorId: interaction.user.id,
        Reason: reason,
        Evidence: Evidence,
        Date: Math.floor(Date.now() / 1000),
    };

    const embedWarn = new MessageEmbed()
    .setTitle("⚠|Warn")
    .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
    .setThumbnail(interaction.guild.iconURL())
    .addField("Usuario", `${user}`)
    .addField("Razon", `${reason}`)
    .addField("Evidencia", `${Evidence}`)
    .addField("Autor", `${interaction.user}`)
    .setColor(color.DangerColor)

    await warnSchema.findOneAndUpdate({guildId: interaction.guild.id, userId: user.id}, {$push: { Content: warnObj}})

    interaction.reply({embeds:[embedWarn]})
  },
};