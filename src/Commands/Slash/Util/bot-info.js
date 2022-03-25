const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("bot-info").setDescription("Quieres saber mas sobre mi usa este comando"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const botEmbed = new MessageEmbed()
    .setTitle("Bot info")
    .addField("🆔|ID", `${client.user.id}`)
    .addField("🤖|Nombre", `${client.user.username}`)
    .addField("🤖|Tag", `#${client.user.discriminator}`)
    .addField("🤖|Color", `#${color.BotColor}`)
    .addField("👮‍♂️|Creador", `alwes#4585`)
    .addField("👼|Agradecimientos", `GatoUsual✨#4660`)
    .addField("🐕‍🦺|Servers", `${client.guilds.cache.size}`, true)
    .addField("🕙|Creacion", `<t:${Math.floor(client.user.createdAt / 1000)}>`, true)
    .addField("👨‍🔧|Support", `[Aqui](https://discord.gg/uV78S3KmBh)`, true)
    .addField("❗ |Comandos", `${client.slashCommands.size}`, true)
    .addField("💻|Memoria", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .setColor(color.BotColor)
    .setTimestamp();

    interaction.reply({ embeds: [botEmbed] });
  },
};