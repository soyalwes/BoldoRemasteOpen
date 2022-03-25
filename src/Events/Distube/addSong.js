const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "addSong",
    async execute(client, queue, song) {
        const AddEmbed = new MessageEmbed()
        .setTitle("💿|Agragado a la playlist")
        .setDescription(`${song.name}`)
        .addField("Link", `[Aqui](${song.url})`, true)
        .addField("Views", `${song.views}`, true)
        .addField("Duracion", `${song.formattedDuration}`, true)
        .setThumbnail(song.thumbnail)
        .setColor("BLUE")
        .setFooter({ text: `Pedido por ${song.user.tag}`})

        queue.textChannel.send({ embeds: [AddEmbed]})
    }
}