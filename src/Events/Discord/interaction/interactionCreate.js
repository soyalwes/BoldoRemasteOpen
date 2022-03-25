const { MessageEmbed, MessageActionRow, MessageButton, Collection } = require("discord.js");

const ms = require("ms")

const { Message } = require("../../../json/ErrorMessage.json")

const ticketSchema = require("../../../Schema/ticket-schema.js");

const toggle = require("../../../Schema/togglecmd-schema");

const color = require("../../../json/Color.json");

const permissions = require("../../../json/Permissions.json");

module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if(interaction.isButton()){
      if(interaction.customId === "ps"){
        if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})

        const queue = client.distube.getQueue(interaction.member.voice.channel)

        if(!queue)return interaction.reply({content:"No hay ninguna cancion reproduciendose"})

        queue.pause()

        interaction.reply({content:"⏸|Cancion pausada"})
      }
      if(interaction.customId === "rs"){
        if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})

        const queue = client.distube.getQueue(interaction.member.voice.channel)

        if(!queue)return interaction.reply({content:"No hay ninguna cancion reproduciendose"})

        if(!queue.pause)return interaction.reply({content:"La cancion ya esta reproduciendose"})
        
        try{
          queue.resume()

           interaction.reply({content:"▶|Reproduciendo la cancion"})
        }catch(e){
          console.log(e)
          
          interaction.reply({content: Message})
        }
      }

      if(interaction.customId === "at"){

      if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

      if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})

      const queue = client.distube.getQueue(interaction.member.voice.channel)

      if(!queue) return interaction.reply({content:"No hay canciones"})

      const autoplay = queue.toggleAutoplay()

      interaction.reply({content:`🔁|Auto Play ${autoplay ? "Prendido" : "Apagado"}`})
      }
      if(interaction.customId === "sk"){
  
      if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

      if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})

      const queue = client.distube.getQueue(interaction.member.voice.channel)

      if(!queue) return interaction.reply({content:"No hay canciones"})

      try{
        queue.skip()

        interaction.reply({content: "⏩|Cancion skipeada"})
      } catch (e){
        console.log(e)

        interaction.reply({content:Message})
      }
      }
      if(interaction.customId === "pr"){
        if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id   !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Tienes que estar en el mismo canal de voz que yo"})
  
        const queue = client.distube.getQueue(interaction.member.voice.channel)
  
        if(!queue) return interaction.reply({content:"No hay canciones"})

        if(!queue.previous())return interaction.reply({content:"No hay canciones anteriores a esta"})

        queue.previous()

        interaction.reply({content:`⏪|Reproduciendo la musica anteriormente escuchada`})
      }
      if(interaction.customId === "TicketButton"){
        const datos = await ticketSchema.findOne({ guildId: interaction.guild.id })

        let channel = interaction.guild.channels.cache.find(ch => ch.name === `ticket-${interaction.user.username}`)

        if(channel)return interaction.reply({content:"Ya tienes un ticket creado", ephemeral: true});

        const { Modal, TextInputComponent, showModal } = require("discord-modals")

        const modalTicket = new Modal()
        .setCustomId("ticketmodal")
        .setTitle("🎫|Tickets")
        .addComponents([
          new TextInputComponent()
          .setCustomId("tickettextcomponent")
          .setLabel("Di la razon del ticket")
          .setStyle("LONG")
          .setMinLength(4)
          .setMaxLength(75)
          .setPlaceholder("Recuerda leer las reglas")
          .setRequired(true)
        ])

        showModal(modalTicket, {
          client: client,
          interaction: interaction
        })
    }
    if(interaction.customId === "DeleteTicket"){

      const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone")

      interaction.channel.edit({ name: "ticket-cerrado" , permissionsOverwrites: []}).then((c) => {
        c.edit({permissionsOverwrites: [{id: everyone.id, deny: [permissions.VC.Perm, permissions.SM.Perm]}]})
      })

      const EmbedAuth = new MessageEmbed()
      .setTitle("Opciones de seguridad")
      .setDescription("Opciones de seguridad activadas\nElije unas de las de abajo")
      .setColor(color.SuccesColor);

      const rowOption = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId("TicketDeleteFinal")
        .setEmoji("❌")
        .setLabel("|Borrar ticket")
        .setStyle("DANGER"),

        new MessageButton()
        .setCustomId("Transcript")
        .setEmoji("♻")
        .setLabel("|Transcribir ticket")
        .setStyle("PRIMARY")
      )

      interaction.reply({embeds:[EmbedAuth], components:[rowOption]})
    }
    if(interaction.customId === "Transcript"){
      const { createTranscript } = require('discord-html-transcripts');

      const attachment = await createTranscript(interaction.channel)

      interaction.reply({ files: [attachment]})
    }
    if(interaction.customId === "TicketDeleteFinal"){
      interaction.reply({content:"Borrando el ticket en 10 segundos"})
      setTimeout(() => {
        interaction.channel.delete()
      }, 10000)
    }
  }

  const Timeout = new Collection()

    if (interaction.isCommand() || interaction.isContextMenu()) {
      const slashCmds = client.slashCommands.get(interaction.commandName);

      if (!slashCmds) return;

      try {
        const datos = await toggle.findOne({ guildId: interaction.guild.id })
        if(datos){
        if (datos.Comando.includes(`${interaction.commandName}`))
          return interaction.reply({
            content: "Este comando esta desactivado",
          });
        
        } else {
          await slashCmds.run(client, interaction)
        }
      } catch (e) {
        interaction.reply({ content: Message });

        console.log(e);
      }
    }
  },
};
