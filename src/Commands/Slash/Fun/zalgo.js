const { SlashCommandBuilder } = require("@discordjs/builders");
const zalgo = require("to-zalgo")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zalgo")
    .setDescription("Ve texto glitcheado")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Escribe el texto que quieres ver en forma de zalgo")
        .setRequired(true)
    ),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let text = interaction.options.getString("text")

    if(text.length > 200)return interaction.reply({content:"No puedes poner mas de 200 letras"})

    interaction.reply({content:`${zalgo(text)}`})
  },
};
