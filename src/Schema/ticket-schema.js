const { model, Schema } = require("mongoose")

const TicketSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    allowNotification: {
        type: Boolean,
        required: true
    },
    staffRolId: {
        type: String,
        required: false
    },
})

module.exports = model("ticket", TicketSchema)