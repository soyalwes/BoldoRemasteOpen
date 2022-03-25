const { SlashCommandBuilder } = require("@discordjs/builders");
const { Util } = require("discord.js")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Di algo")
    .addStringOption((option) =>
      option
        .setName("say")
        .setDescription("Escribe lo que quieres que diga")
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

    let say = interaction.options.getString("say")

    if(say.length > 150)return interaction.reply({content:"No puedes poner mas de 150 letras"})

    for(let i = 0; say.includes("@here") || say.includes("@everyone"); i++){
      say = say.replace(/@here/, "here")
      say = say.replace(/@everyone/, "everyone")
    }

    interaction.reply({content:`${Util.cleanContent(say, interaction)}`})
  },
};
