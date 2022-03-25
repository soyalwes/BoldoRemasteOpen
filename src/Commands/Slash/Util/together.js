const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("together").setDescription("Ve videos de youtube en llamada con tus amigos"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

    client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, "youtube").then(async invite => {
        const togetherEmbed = new MessageEmbed()
      .setTitle("🟥|toGether")
      .setDescription(`Aqui tienes disfruta\n ${invite.code}`)
      .setColor("RED")

        return interaction.reply({embeds:[togetherEmbed]});
    })
  },
};