const { Schema, model } = require("mongoose")

const list = new Schema({
    guildId: {
        type: String,
        required: true
    },
    Comando: {
        type: Array,
        required: true
    },
})

module.exports = model("toggle", list)