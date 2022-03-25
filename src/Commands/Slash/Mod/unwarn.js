const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warnSchema = require("../../../Schema/warn-schema");
const sm = require("../../../json/SuccesMessages.json");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Quita un warn de un usuario")
    .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Selecciona al usuario")
      .setRequired(true)
  )
    .addNumberOption((option) =>
      option.setName("id").setDescription("Di la id del warn").setRequired(true)
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

    const id = interaction.options.getNumber("id");

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

    if(user === interaction.member)return interaction.reply({content:"No puedes quitarte advertencias a ti mismo"})

    if(user === client.member)return interaction.reply({content: "No puedes quitarme las advertencias, en teoria no deberia tener"})
     
    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content: "No puedes quitar advertencias a alguien por encima de ti"})

    if(user.bot)return interaction.reply({content:"No creo que un bot tenga advertencias"})

    warnSchema.findOne({ guildId: interaction.guild.id, userId: user.id}, async(err, data) => {
      if(err) return interaction.reply({content: "No tengo datos"})
      if(data){
        let idFinal = id - 1;

        data.Content.splice(idFinal, 1)

        interaction.reply({content:"Warn eliminado"})
        data.save()
      } else {
        return interaction.reply({content:"No hay warns para borrar"})
      }
    })
  },
};
