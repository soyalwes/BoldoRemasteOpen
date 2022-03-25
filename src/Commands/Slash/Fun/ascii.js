const { SlashCommandBuilder } = require("@discordjs/builders");
const figlet = require("figlet")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Haz un ascii")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Di lo que quieres poner en ascii")
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

    figlet.text(text, function(err, data) {
        if(err){
            console.log(err)

            return interaction.reply({content:"Ocurrio un error"})
        }
        if(data.length > 350)return interaction.reply({content:"Da un texto mas corto"})

        interaction.reply({content:" \`\`\`" + data + "`\`\`\ "})
    })
  },
};
