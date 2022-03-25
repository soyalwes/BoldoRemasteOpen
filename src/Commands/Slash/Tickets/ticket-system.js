const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const ticketSchema = require("../../../Schema/ticket-schema.js");
const color = require("../../../json/Color.json")
const Permissions = require("../../../json/Permissions.json")
const { DataFound } = require("../../../json/ErrorMessage.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("ticket-system").setDescription("Configura el sistema de tickets")
  .addChannelOption((option) => 
    option
    .setName("channel")
    .setDescription("Elije el canal")
    .setRequired(true))
  .addChannelOption((option) => 
      option
      .setName("category")
      .setDescription("Elije la categoria donde iran lo tickets")
      .setRequired(true))
    .addBooleanOption((option) => 
      option
      .setName("notification")
      .setDescription("Haz que notifique a los staff cuando se habre un ticket")
      .setRequired(true))
  .addRoleOption((option) => 
    option
    .setName("role-staff")
    .setDescription("Elije el rol del staff")
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

    const channel = interaction.options.getChannel("channel")

    const category = interaction.options.getChannel("category")

    const notifi = interaction.options.getBoolean("notification")

    const roleStaff = interaction.options.getRole("role-staff")

    let datos = await ticketSchema.findOne({ guildId: interaction.guild.id })

    if(datos)return interaction.reply({content: `${DataFound} usa /ticket-setup`})

    if(!channel.type === "GUILD_TEXT")return interaction.reply({content:"Debes elejir un canal de texto"})

    if(!category.type === "GUILD_CATEGORY")return interaction.reply({content: "Debes elejir una categoria donde los tickets se pondran"})

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId("TicketButton")
        .setEmoji("🎫")
        .setLabel(" ")
        .setStyle("PRIMARY")
      )

      const embedTicket = new MessageEmbed()
      .setTitle("🎫|Ticket")
      .setDescription("Presiona el boton de abajor para crear un ticket!")
      .setColor(color.BotColor)
      .setTimestamp()

    if(!datos){
      let datos = new ticketSchema({
        guildId: interaction.guild.id,
        channelId: channel.id,
        categoryId: category.id,
        allowNotification: notifi,
        staffRolId: roleStaff.id || null,
      })
      interaction.reply({content:"Sistema de ticket creado", ephemeral: true});

      client.channels.cache.get(`${channel.id}`).send({embeds:[embedTicket], components:[row]});

      await datos.save();
    }
  },
};