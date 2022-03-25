const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "playSong",
  async execute(client, queue, song) {
    const PlayEmbed = new MessageEmbed()
      .setTitle("📀|Escuchando ahora")
      .setDescription(`${song.name}`)
      .addField("Link", `[Aqui](${song.url})`, true)
      .addField("Views", `${song.views}`, true)
      .addField("Duracion", `${song.formattedDuration}`, true)
      .setThumbnail(song.thumbnail)
      .setColor("BLUE")
      .setFooter({ text: `Pedido por ${song.user.tag}` });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("pr")
          .setLabel(" ")
          .setEmoji("⏪")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("ps")
          .setLabel(" ")
          .setEmoji("⏸")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("at")
          .setLabel(" ")
          .setEmoji("🔁")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
        .setCustomId("rs")
        .setLabel(" ")
        .setEmoji("▶")
        .setStyle("PRIMARY") 
      )
      .addComponents(
        new MessageButton()
          .setCustomId("sk")
          .setLabel(" ")
          .setEmoji("⏩")
          .setStyle("PRIMARY")
      );
    queue.textChannel.send({ embeds: [PlayEmbed], components: [row] });
  },
};