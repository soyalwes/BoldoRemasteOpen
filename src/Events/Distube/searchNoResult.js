module.exports = {
    name: "searchNoResult",
    async execute(client, message, query) {
        message.channel.send(`No hay resultados para: ${query}`)
    }
}