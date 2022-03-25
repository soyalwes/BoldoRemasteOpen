module.exports = {
    name: "initQueue",
    async execute(client, queue) {
        queue.autoplay = false,
        queue.volume = 75
    }
}