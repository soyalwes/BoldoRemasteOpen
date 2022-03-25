const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const { Message } = require("../../../json/ErrorMessage.json")
const Permissions = require("../../../json/Permissions.json")


let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Desbloquea un canal")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Elije el canal a desbloquear")
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

    let channel =
      interaction.options.getChannel("channel") || interaction.channel;

    let permsBot = interaction.guild.me.permissions.has(Permissions.MC.Perm);
    if (!permsBot)
      return interaction.reply({
        content:
          `${Permissions.MessageNoPermissionsBot}\nPermiso: **${Permissions.MC.MessagePerms}**`,
      });

    let perms = interaction.member.permissions.has(Permissions.MC.Perm);
    if (!perms)
      return interaction.reply({
        content:
          `${Permissions.MessageNoPermissions}\nPermiso: **${Permissions.MC.MessagePerms}`,
      });

    let everyone = interaction.guild.roles.cache.find(
      (r) => r.name === "@everyone"
    );

    if (everyone.permissionsIn(channel).has(Permissions.SM.Perm))
      return interaction.reply({ content: "El canal ya esta desbloqueado" });

    if (channel.editable)
      return interaction.reply({ content: "No puedo bloquear ese canal" });

    try {
      channel.permissionOverwrites.edit(everyone, {
        SEND_MESSAGES: true,
        ADD_REACTIONS: true,
      });

      interaction.reply({ content: "Listo", ephemeral: true });

      const embedLock = new MessageEmbed()
        .setTitle("🔓|UnLock")
        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
        .setDescription(`${channel} a sido desbloqueado`)
        .setFooter({ text: `Autor: ${interaction.member.user.tag}` })
        .setColor("GREEN");

      channel.send({ embeds: [embedLock] });
    } catch (e) {
      console.log(e);

      interaction.reply({ content: Message });
    }
  },
};
