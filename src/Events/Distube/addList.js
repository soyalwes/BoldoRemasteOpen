const { MessageEmbed } = require("discord.js")
const color = require("../../json/Color.json")

module.exports = {
    name: "addList",
    async execute(client, queue, playlist) {
        const addListEmbed = new MessageEmbed()
        .setTitle("🗃|Playlist agregada")
        .setDescription(playlist.name)
        .addField("Link", `[Aqui](${playlist.url})`, true)
        .addField("Canciones", `${playlist.songs.length}`, true)
        .addField("Duracion", `${playlist.formattedDuration}`, true)
        .setThumbnail(playlist.thumbnail)
        .setColor(color.BotColor)
        .setFooter({ text: `Pedido por ${playlist.user.tag}`})

        queue.textChannel.send({embeds:[addListEmbed]})
    }
}