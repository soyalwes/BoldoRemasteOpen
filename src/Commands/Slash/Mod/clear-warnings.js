const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Message } = require("../../../json/ErrorMessage.json")
const warnSchema = require("../../../Schema/warn-schema");
const sm = require("../../../json/SuccesMessages.json");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json");


let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear-warnings")
    .setDescription("Limpia las advertencias por completo de un usario")
    .addUserOption((option) => 
      option
      .setName("user")
      .setDescription("selecciona al usuario")
      .setRequired(true)),

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

      if(user === interaction.member)return interaction.reply({content:"No puedes quitarte a ti mismo todas las sanciones"})

      if(user === client.member)return interaction.reply({content: "No puedes quitarme todas las sanciones, en teoria no deberia tener"})

      const datos = await warnSchema.findOne({ guildId: interaction.guild.id, userId: user.id })
      if(!datos)return interaction.reply({content: "No tengo datos sobre este usuario"})

      if(datos){

      const embedWArnClear = new MessageEmbed()
      .setTitle("🧽|Clear warns")
      .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
      .setDescription(`Borrando todos los datos de ${user}`)
      .setFooter({ text: `Borrado por: ${interaction.user.tag}`})
      .setColor(color.SuccesColor)

      interaction.reply({embeds:[embedWArnClear]})

      await warnSchema.findOneAndDelete({guildId: interaction.guild.id, userId: user.id})
      } else {
        interaction.reply({content: Message})
      }
  },
};
