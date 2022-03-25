const { Message } = require("../../json/ErrorMessage.json")

module.exports = {
  name: "error",
  async execute(client, channel, error) {
    console.log(error);

    channel.send({ content: Message });
  },
};
