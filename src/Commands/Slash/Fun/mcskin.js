const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Other, Message } = require("../../../json/ErrorMessage.json")
const color = require("../../../json/Color.json")
const request = require("request")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcskin")
    .setDescription("Ve la skin de un jugador premiun de mincraft")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Pon el nombre del jugador")
        .setRequired(true)
    ),

  async run(client, interaction) {
      let name = interaction.options.getString("name")

    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    if(name.length > 15)return interaction.reply({content: "El nombre debe ser menor a 15 letras"})

    let MojangApi = `https://api.mojang.com/users/profiles/minecraft/${name}`

    request(MojangApi, function(e, resp, body){ 
        if(e)return interaction.reply({content: `${Other}\n[❌] Nombre Invalido`})
        try{
            body = JSON.parse(body)

            let playerId = body.id

            let render = `https://mc-heads.net/body/${playerId}/128.png`
            let skin = `https://crafatar.com/skins/${playerId}.png`
            let avatar = `https://mc-heads.net/avatar/${playerId}.png`
            
            const embedPlayer = new MessageEmbed()
            .setTitle("Skin")
            .setDescription(`Skin de [${name}](${skin})`)
            .setColor(color.BotColor)
            .setThumbnail(avatar)
            .setImage(render)

            interaction.reply({embeds:[embedPlayer]})
        }catch(e){
            interaction.reply({content: Message})

            console.log(e)
        }
    })
  },
};
