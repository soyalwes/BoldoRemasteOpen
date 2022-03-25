const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "finishSong",
    async execute(client, queue, song) {
        const PlayEmbed = new MessageEmbed()
        .setTitle("🎼|Cancion terminda")
        .setDescription(`${song.name}`)
        .addField("Link", `[Aqui](${song.url})`, true)
        .addField("Views", `${song.views}`, true)
        .addField("Duracion", `${song.formattedDuration}`, true)
        .setThumbnail(song.thumbnail)
        .setColor("BLUE")
        .setFooter({ text: `Pedido por ${song.user.tag}`})

        queue.textChannel.send({ embeds: [PlayEmbed]})
    }
}