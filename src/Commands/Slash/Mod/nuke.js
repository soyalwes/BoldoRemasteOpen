const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Permissions = require("../../../json/Permissions.json");
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("nuke").setDescription("Resetea el canal")
  .addChannelOption((option) => 
  option
    .setName("channel")
    .setDescription("Elije el canal que resetearas")
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
    let channel = interaction.options.getChannel("channel") || interaction.channel;

    let permsBot = interaction.guild.me.permissions.has(Permissions.MC.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.MC.MessagePerms}`,
      });

    let perms = interaction.member.permissions.has(Permissions.AD.Perm);
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.AD.MessagePerms}`,
      });

      interaction.reply({content:"Reseteando"})

      channel.clone().then((ch) => {
          ch.setParent(channel.parent);
          ch.setPosition(channel.position);
          channel.delete()

            const embedNuke = new MessageEmbed()
            .setTitle("🧨|Nuke")
            .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
            .setDescription("El canal a sido reseteado")
            .addField("Autor", `${interaction.user}`)
            .addField("Canal", `${channel.name}`)
            .setColor(color.DangerColor);

            ch.send({embeds:[embedNuke]})
            
      })
  },
};