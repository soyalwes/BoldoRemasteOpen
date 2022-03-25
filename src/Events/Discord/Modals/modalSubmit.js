const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const ticketSchema = require("../../../Schema/ticket-schema.js");

const Permissions = require("../../../json/Permissions.json");

const color = require("../../../json/Color.json");

const { Message } = require("../../../json/Permissions.json")

module.exports = {
    name: "modalSubmit",
    async execute(client, modal) {
        if(modal.customId === "ticketmodal"){
            const Reason = modal.getTextInputValue("tickettextcomponent")

            const datos = await ticketSchema.findOne({ guildId: modal.guild.id })
        
            await modal.deferReply({ ephemeral: true })

            const everyone = modal.guild.roles.cache.find(r => r.name === "@everyone")
    
            modal.followUp({ content: "Creando tickets" }).then(() => {
                try{
                    if(datos.staffRolId !== null){
                    modal.guild.channels.create(`ticket-${modal.user.username}`, {
                        type: "GUILD_TEXT",
                        parent: `${datos.categoryId}`,
                        permissionOverwrites: [
                          {
                            id: modal.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                          },
                          {
                            id: datos.staffRolId,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                          },
                          {
                            id: everyone.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                          },
                        ],
                      }).then((r) => {
                        const embedTicketOne = new MessageEmbed()
                        .setTitle("🎫|Ticket")
                        .setDescription(`Bienvenido ${modal.member} a tu ticket\nRazon: ${Reason}\nDeja tu queja o duda espera a un staff\nPuedes usar el boton de abajo para borrar este ticket`)
                        .setColor(color.BotColor)
              
                        const rowTicket = new MessageActionRow()
                        .addComponents(
                          new MessageButton()
                            .setCustomId("DeleteTicket")
                            .setEmoji("❌")
                            .setLabel("Borrar ticket")
                            .setStyle("DANGER")
                        );
                        if(datos.allowNotification === true){
                          r.send({embeds:[embedTicketOne], components:[rowTicket], content: `${everyone} <@&${datos.staffRolId}>`})
                        } else {
                          r.send({embeds:[embedTicketOne], components:[rowTicket]})
                        }
                      })
                    } else {
                    modal.guild.channels.create(`ticket-${modal.user.username}`, {
                        type: "GUILD_TEXT",
                        parent: `${datos.categoryId}`,
                        permissionOverwrites: [
                          {
                            id: modal.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                          },
                          {
                            id: everyone.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                          },
                        ],
                      }).then((r) => {
                        const embedTicketOne = new MessageEmbed()
                        .setTitle("🎫|Ticket")
                        .setDescription(`Bienvenido ${modal.member} a tu ticket\nRazon: ${Reason}\nDeja tu queja o duda espera a un staff\nPuedes usar el boton de abajo para borrar este ticket`)
                        .setColor(color.BotColor)
              
                        const rowTicket = new MessageActionRow()
                        .addComponents(
                          new MessageButton()
                            .setCustomId("DeleteTicket")
                            .setEmoji("❌")
                            .setLabel("Borrar ticket")
                            .setStyle("DANGER")
                        );
                        if(datos.allowNotification === true){
                          r.send({embeds:[embedTicketOne], components:[rowTicket], content: `${everyone} <@&${datos.staffRolId}>`})
                        } else {
                          r.send({embeds:[embedTicketOne], components:[rowTicket]})
                        }
                      })
                    }
                }catch(e){
                  console.log(e)
            
                  return modal.followUp({content: Message, ephemeral: true})
                }
            })

    }
    }
}