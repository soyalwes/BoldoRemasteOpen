const { SlashCommandBuilder } = require("@discordjs/builders");
const ticketSchema = require("../../../Schema/ticket-schema.js");
const Permissions = require("../../../json/Permissions.json");
const { NoData } = require("../../../json/ErrorMessage.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("ticket-notification").setDescription("Activa o desactiva la notificaciones cuando se habre un ticket")
  .addBooleanOption((option) => 
    option
    .setName("notificacion")
    .setDescription("Activa con true o desactiva con false")
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
    let notifi = interaction.options.getBoolean("notificacion")

    let permsBot = interaction.guild.me.permissions.has(Permissions.AD.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.AD.MessagePerms}`,
      });

    let perms = interaction.member.permissions.has();
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.AD.MessagePerms}`,    
      });

    const datos = await ticketSchema.findOne({guildId: interaction.guild.id })

    if(!datos)return interaction.reply({content: NoData})

    await ticketSchema.findOneAndUpdate({ guildId: interaction.guild.id, allowNotification: notifi})

    interaction.reply({content:`Cambiando la notificaciones a **${notifi}**`})
  },
};