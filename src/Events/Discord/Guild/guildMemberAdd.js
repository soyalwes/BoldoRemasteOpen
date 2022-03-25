const { MessageEmbed, MessageAttachment } = require("discord.js")
const welSchema = require("../../../Schema/welcome-schema")
const Canvas = require("canvas");

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        const datos = await welSchema.findOne({guildId: member.guild.id})
        if(!datos)return

        if(member.guild.id === datos.guildId){
            let messWelcome = datos.message

            if(datos.message === null) messWelcome = `Eres el miembro ${member.guild.memberCount}`

            let image = "https://i.imgur.com/LrI7ouQ_d.webp?maxwidth=640&shape=thumb&fidelity=medium"

            const canvas = Canvas.createCanvas(1018, 468)
            const ctx = canvas.getContext("2d")

            const background = Canvas.loadImage(`${welcomeImage}`);
            ctx.drawImage(background, 0 , 0, canvas.width, canvas.height)

            ctx.fillStyle = "#ffff";
            ctx.font = "100px Segoe UI Black"

            ctx.fillText("Bienvenido\nQue la pases bien", 460, 340)
            ctx.fillText(`${member.user.username}`, 460, 340)

            ctx.beginPath()
            ctx.arc(247,238,175,0, Math.PI * 2, true)
            ctx.clip()

            const avatar = await canvas.loadImage(member.user.displayAvatarURL({ size: 2048, dynamic: true}))
            ctx.drawImage(avatar, 72,63,350,350)

            if(datos.linkImage !== null) image = datos.linkImage

                const attachments = new MessageAttachment(canvas.toBuffer(),  `Bienvenido.png`)
            
                if(datos.messageEmbed === true){
                    try{
                    const embedWelcome = new MessageEmbed()
                    .setTitle("👋|Bienvenido")
                    .setDescription(`${messWelcome}`)
                    .setImage(attachments);

                    client.channels.cache.get(datos.channelId).send({embeds:[embedWelcome]})
                    }catch(e){
                        console.log(e)
                    }
             }
               if(datos.messageEmbed === false){
                   client.channels.cache.get(datos.channelId).send({content: datos.message, file:[attachments]})
               }
               if(datos.roleId !== null) member.roles.add(datos.roleId)
        }
    }
}