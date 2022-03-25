const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("server-info").setDescription("Ve la info del servers"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let verfLevels = {
      "NONE":"Ninguno",
      "LOW":"Bajo",
      "MEDIUM":"Medio",
      "HIGH":"Alto",
      "":"Super alto"
    }
    let server = interaction.guild;

    const serverEmbed = new MessageEmbed()
    .setTitle(`Info de ${server.name}`)
    .setThumbnail(server.iconURL())
    .setAuthor({ name: `${server.name}`, iconURL: `${server.iconURL({ size: 1024, dynamic: true})}`})
    .addField("🆔|ID", `${server.id}`)
    .addField("🕐|Fecha de creacion", `<t:${Math.floor(server.joinedAt / 1000)}>`)
    .addField("🧔|Owner", `${(await server.fetchOwner()).user.tag}`)
    .addField("🆔|ID del Owner", `${server.ownerId}`)
    .addField("👱‍♂️|Miembros", `${server.memberCount}`)
    .addField("🤖|Bots", `${server.members.cache.filter((m) => m.user.bot).size}`)
    .addField("👪|Roles", `${server.roles.cache.size}`)
    .addField("🗃|Canales", `${server.channels.cache.size}`)
    .addField("🗄|Categorias", `${server.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}`)
    .addField("🗃|Canales de texto", `${server.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}`)
    .addField("🔉|Canales de voz", `${server.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}`)
    .addField("🤣|Emojis", `${server.emojis.cache.size}`)
    .addField("💎|Booster", `${server.premiumSubscriptionCount.toString()}`)
    .addField("✅|Nivel de verificacion", `${verfLevels[server.verificationLevel]}`)
    .setColor("RANDOM");

    interaction.reply({embeds:[serverEmbed]})
  }
}