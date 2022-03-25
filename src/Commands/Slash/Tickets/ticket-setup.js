const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js")
const { NoData } = require("../../../json/ErrorMessage.json");
const ticketSchema = require("../../../Schema/ticket-schema.js");
const Permissions = require("../../../json/Permissions.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("ticket-setup").setDescription("Pon el mensaje para hacer tickets")
  .addChannelOption((option) => 
    option
    .setName("channel")
    .setDescription("Elije el canal en donde se mandara el mensaje de tickets")
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

    let channel = interaction.options.getChannel("channel") || interaction.channel;

    const datos = await ticketSchema.findOne({ guildId: interaction.guild.id })
    
    if(!datos)return interaction.reply({content: NoData})

    await ticketSchema.findOneAndUpdate({guildId: interaction.guild.id, channelId: channel.id})

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

      client.channels.cache.get(channel.id).send({embeds:[embedTicket], components:[row]})

      interaction.reply({content:"Sistema de tickets actualizado", ephemeral: true})
  },
};