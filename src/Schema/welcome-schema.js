const { model, Schema } = require("mongoose")

const welSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    linkImage: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    messageEmbed: {
        type: Boolean,
        required: true
    },
    roleId: {
        type: String,
        required: false
    }
})

module.exports = model("welcome", welSchema)