const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js")
const weather = require("weather-js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Ve el clima en una cuidad")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Di la cuidad a revisar el clima")
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
    let city = interaction.options.getString("city")

    weather.find({search: city, degreeType: "C"}, function (e, result){
        if(e) return console.log(e)

        if(result.length === 0)
            return interaction.reply({content:"Ingresa una ciudad valida"})
        
        let current = result[0].current;
        let location = result[0].location;

        let days = {
            "Sunday" : "Domingo",
            "Monday" : "Lunes",
            "Tuesday" : "Martes",
            "Wednesday" : "Miercoles",
            "Thursday" : "Jueves",
            "Friday" : "Viernes",
            "Saturday" : "Sabado"
        }

        const weatherEmbed = new MessageEmbed()
        .setTitle(`🌥|${current.skytext}`)
        .setAuthor({name: `${current.observationpoint}`})
        .setThumbnail(current.imageUrl)
        .addField("Horario", `UTC ${location.timezone}`)
        .addField("Tipo de grado", `°${location.degreetype}`)
        .addField("Temperatura", `°C ${current.temperature}`)
        .addField("Sencacion termica", `°C ${current.feelslike}`)
        .addField("Viento", `${current.winddisplay}`)
        .addField("Humedad", `${current.humidity}%`)
        .addField("Fecha", `${current.date}`)
        .addField("Dia", `${days[current.day]}`)
        .setColor("GREEN")
        .setTimestamp()

        interaction.reply({embeds:[weatherEmbed]})
    })
  },
};
