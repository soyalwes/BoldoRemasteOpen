const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warnSchema = require("../../../Schema/warn-schema");
const sm = require("../../../json/SuccesMessages.json");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Ve el historial de advertencias de la persona")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elije el usuario")
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

    const user = interaction.options.getMember("user") || interaction.member;

    let datos = await warnSchema.findOne({guildId: interaction.guild.id, userId: user.id})

    if(!datos){
      if(user === interaction.member)return interaction.reply({content:"No tengo tus datos"})
      return interaction.reply({content:"Este Usuario no tiene warns"})
    }

    if(user.bot)return interaction.reply({content:"Un bot no deberia tener warnings"})

    const embedWarnings = new MessageEmbed()
    .setTitle("📋|Warnings")
    .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
    .setThumbnail(interaction.guild.iconURL())
    .setDescription(`${datos.Content.map(
        (w, i) => `**Autor**: <@${w.AuthorId}>\n**Fecha**: <t:${w.Date}>\n**Razon**: ${w.Reason}\n**Evidencia**: ${w.Evidence}`
    ).join("\n\n")}`)
    .setColor(color.BotColor)

    interaction.reply({embeds:[embedWarnings]})
  },
};
