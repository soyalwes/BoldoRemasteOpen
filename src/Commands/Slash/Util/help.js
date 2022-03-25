const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu, MessageEmbed} = require("discord.js")
const color = require("../../../json/Color.json")
const Permissions = require("../../../json/Permissions.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Necesitas ayuda?, ya no mas!")
  .addStringOption((option) =>
    option
    .setName("command")
    .setDescription("Ve la descripcion detallada de un comando")
    .setRequired(false)),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);
    const command = interaction.options.getString("command") || "todos"

    let commands = ["todos", "weather", "user-info", "together", "set-nick", "server-info", "say"]

    if(command === "weather"){
      const embedWeatherhelp = new MessageEmbed()
      .setTitle("Weather")
      .setDescription(" \`/weather city:[Cuidad] \`\nPermiso: Ninguno\nAl usar este comando debe ingresar la cuidad en donde quieres ver el clima")
      .setColor(color.BotColor)

      return interaction.reply({embeds:[embedWeatherhelp]})
    }
    if(command === "user-info"){
      const embedUserInfoHelp = new MessageEmbed()
      .setTitle("user-info")
      .setDescription(" \`/user-info user:[usuario] | /user-info\`\nPermiso: Ninguno\nAl utilizar el comando sin elejir el usuario te mostrara tu info por el otro lado tambien puedes elejir al usuario que quieras ver su info")
      .setColor(color.BotColor)

      return interaction.reply({embeds:[embedUserInfoHelp]})
    }
    if(command === "together"){
      const embedToGether = new MessageEmbed()
      .setTitle("together")
      .setDescription("\`/together\`\nPermiso: Ninguno\nRecuerda que al utilizar este comando deberias estar en un canal de voz lo que hace este comando es activar una actividad de nombre together que sirve para ver video de youtube en el discord")
      .setColor(color.BotColor);

      return interaction.reply({embeds:[embedToGether]})
    }
    if(command === "set-nick"){
      const embedsetNick = new MessageEmbed()
      .setTitle("set-nick")
      .setDescription(" \`/set-nick: [nombre a establecer] | /set-nick\`\nPermiso: administrar apodos\nEste comando sirve para cambiarte el nombre de usuario en el sirver si decides no agregar un nombre se te pondra tu nombre de usuario de discord")
      .setColor(color.BotColor)

      return interaction.reply({embeds:[embedsetNick]})
    }
    if(command === "server-info"){
      const embedserverinfo = new MessageEmbed()
      .setTitle("server-info")
      .setDescription(" \` /server-info \`\nPermiso: Ninguno\nEste comando muestra la informacion del server no puedes ver informacion de otros server por problemas de privacidad")
      .setColor(color.BotColor)

      return interaction.reply({embeds:[embedserverinfo]})
    }
    if(command === "say"){
      const embedSay = new MessageEmbed()
      .setTitle("say")
      .setDescription(" \`/say: [frase a decir]\`\nPermiso: Ninguno\nEste comando hara que el bot reproduzca lo que quieras decir")
    }

    if(command === "todos"){
    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId("Menu help")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions([
            {
                label: "Slash commands: Util",
                description: "Comandos de la categoria utilidades",
                value: "1111"
            },
            {
                label: "Slash commands: Musica",
                description: "Comandos de la categoria musica",
                value: "1112"
            },
            {
               label: "Slash commands: Mod",
               description: "Comandos de la categoria Moderacion",
               value: "1113"
            },
            {
                label: "Slash commands: Fun",
                description: "Comandos de la categoria: diversion",
                value: "1114"
            },
            {
              label: "Slash commands: Ticket",
              description: "Comandos de la categoria: tickets",
              value: "1115"
            }
        ]),
        new MessageSelectMenu()
        .setCustomId("Menu help")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions([
          {
            label: "Slash commands: Config",
            description: "Comandos de la categoria: configuracion",
            value: "1116"
          }
        ])
    )

    const embedHelp1 = new MessageEmbed()
    .setTitle("Help 1: Util")
    .addField("avatar", "Muestra el avatar de un usuario")
    .addField("botupdates", "Ve mis actualizaciones")
    .addField("channelinfo", "Ve la informacion de un canal")
    .addField("Command on", "Prende comandos")
    .addField("Command off", "Apaga comandos")
    .addField("Ping", "Ve mi latencia en milisegundos")
    .addField("report-error", "Reporta errores en el bot")
    .addField("say", "Digo lo que tu quieras")
    .addField("serverinfo", "Muestro la informacion del server")
    .addField("setnick", "Cambio tu nick")
    .addField("toGether", "Ve video de youtube en llamada con tus amigos")
    .addField("userinfo", "Muestro la informacion de un usuario")
    .addField("weather", "Ve el clima de una cuidad")
    .setColor(color.BotColor);

    const embedHelp3 = new MessageEmbed()
    .setTitle("Help 3: Musica")
    .addField("autoplay", "Activa o desactiva la reproduccion automatica")
    .addField("filter", "Agrega filtros a tu musica")
    .addField("join", "Me uno al canal de voz")
    .addField("leave", "Me salgo del canal de voz")
    .addField("nowplaying", "Ve lo que estoy reproduciendo ahora mismo")
    .addField("pause", "Pausa la cancion")
    .addField("play", "Reproduzco una cancion")
    .addField("previous", "Reproduzco la cancion anterior")
    .addField("queue", "Muestra la canciones que se esta reproduciendo")
    .addField("resume", "Reproduce la musica de nuevo")
    .addField("shuffle", "Randomiza la playlist")
    .addField("skip", "Salta la cancion")
    .addField("Volume", "Cambia la cancion")
    .setFooter({ text: "Por ahora esta parte no funciona"})
    .setColor(color.BotColor);

    const embedHelp2 = new MessageEmbed()
    .setTitle("Help 2: Tickets")
    .addField("ticket-system", "Configura el sistema de tickets")
    .addField("ticket-setup", "Genera un nuevo mensaje de generar tickets")
    .addField("ticket-set-staff", "Actualiza el rol del staff")
    .addField("ticket-noftification", "Activa o desactiva la notificaciones")
    .setColor(color.BotColor);

    const embedHelp5 = new MessageEmbed()
    .setTitle("Help 5: Fun")
    .addField("8ball", "la bola 8 tendra la razon?")
    .addField("ascii", "Ve tus textos en grandes")
    .addField("jumbo", "Ve emojis en grande")
    .addField("mcskin", "Ve la skin de un jugador")
    .addField("memes", "Memes sacados de reddit")
    .addField("zalgo", "Distorciona una oracion")
    .setColor(color.BotColor);

    const embedHelp6 = new MessageEmbed()
    .setTitle("Help 6: config")
    .addField("set-welcome", "Configura las bienvenidas")
    .setColor(color.BotColor);

    interaction.reply({content:"En construccion"})
      }
      if(!command.includes(commands))return interaction.reply({content:"Ese comando no existe o se esta en progreso"})
  },
};
