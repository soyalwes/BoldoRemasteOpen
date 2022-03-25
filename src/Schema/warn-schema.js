const { model, Schema } = require("mongoose")

const warnSchema = new Schema({
    guildId : {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    Content: {
        type: Array,
        required: true
    }
})

module.exports = model("warns", warnSchema)