const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Ve tu info o la de otro usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
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
    let user = interaction.options.getMember("user") || interaction.member;

    let states = {
        "online" : "🟢|En linea",
        "dnd": "🔴|No molestar",
        "idle": "🟡|Ausente",
        "ofline": "🚫|Desconectado",
    }

    const userEmbed = new MessageEmbed()
    .setTitle(`Info de ${user.user.tag}`)
    .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username})
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addField("🧔|Apodo", `${user.nickname ? user.nickname : "No tiene apodo"}`)
    .addField("📌|TAG", `#${user.user.discriminator}`)
    .addField("🆔|ID", `${user.id}`)
    .addField("👨‍🦱|Status", `${states[user.presence.status]}`)
    .addField("🔗|Link del avatar", `[Aqui](${user.displayAvatarURL({ size: 2048, dynamic: true})})`)
    .addField("💎|Boost", `${user.premiunSince ? "Si" : "No"}`)
    .addField("🕕|Datos de creacion", `<t:${Math.floor(user.user.createdAt / 1000)}>`)
    .addField("🕣|Entrada al servidor", `<t:${Math.floor(user.joinedAt / 1000)}>`)
    .addField("🧛‍♂️|Roles del usuario", `${user.roles.cache.map((role) => role.toString()).join(", ")}`)
    .setColor("RANDOM")

    interaction.reply({embeds:[userEmbed]})
  },
};
