const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel-linfo")
    .setDescription("Ve la info de un canal")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Elije el canal")
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

    let channel = interaction.options.getChannel("channel") || interaction.channel;

    let types = {
        GUILD_TEXT: "Texto",
        GUILD_CATEGORY: "Categoria",
        GUILD_VOICE: "Voz",
        GUILD_NEWS: "Anuncios",
        GUILD_STAGE_VOICE: "Esenario",
    }

    let tof = {
        true: "Si",
        false: "No"
    }

    const embedChannel = new MessageEmbed()
    .setTitle(`Info de ${channel.name}`)
    .setAuthor({ name: `${channel.name}`, iconURL: `${interaction.guild.iconURL({size: 2048, dynamic: true})}`})
    .addField("📰|Nombre", `${channel.name}`)
    .addField("🆔|ID", `${channel.id}`)
    .addField("⚗|Descripcion", `${channel.topic || "No tiene descripcion"}`)
    .addField("🎲|Tipo", `${types[channel.type]}`)
    .addField("🔞|NSFW", `${tof[channel.nsfw]}`)
    .addField("👶|Creado", `<t:${Math.floor(channel.createdAt / 1000)}>`)
    .setColor("BLUE")

    interaction.reply({embeds:[embedChannel]})
  },
};
