module.exports = {
    name: "empty",
    async execute(client, queue) {
        queue.textChannel.send(`No veo a nadie por aqui, adios`)
    }
}