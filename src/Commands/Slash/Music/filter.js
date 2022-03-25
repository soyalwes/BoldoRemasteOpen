const { SlashCommandBuilder } = require("@discordjs/builders");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Agrega filtros a la musica")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("Di el filtro que quieres usar")
        .setRequired(false)
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

    let filter = interaction.options.getString("filter") || "off"

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Tienes que estar en un canal de voz",
      });

    if (interaction.guild.me.voice.channel &&interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content: "Tienes que estar en el mismo canal de voz que yo"});

    const queue = client.distube.getQueue(interaction.member.voice.channel);

    if (!queue) return interaction.reply({ content: "No hay canciones" });

    if(filter === "off"){
        interaction.reply({content:"0️⃣|Filtros apagados"})

        return queue.setFilter(false)
    }

    if(Object.keys(client.distube.filters).includes(filter)) queue.setFilter(filter)
    else return interaction.reply({content:"Filtro no valido"})

    interaction.reply({content:`🔼|Filtro activado \`${filter}\`\n${queue.filters.join("\n") || "Apagado"}`})

  },
};
