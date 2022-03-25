const { SlashCommandBuilder } = require("@discordjs/builders");
const welSchema = require("../../../Schema/welcome-schema")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
  .setName("set-welcome")
  .setDescription("Pon bienvenidas personalizadas")
  .addChannelOption((option) =>
  option 
    .setName("channel")
    .setDescription("Decide al canal donde va las bienvenidas")
    .setRequired(true))
    .addStringOption((option) =>
      option
      .setName("message")
      .setDescription("Di el mensaje para la bienvenida")
      .setRequired(true)
    ).addBooleanOption((option) => 
        option
        .setName("embed")
        .setDescription("Decide si quieres que el mensaje sea en embed")
        .setRequired(true)
    ).addRoleOption((option) =>
        option
        .setName("role")
        .setDescription("Di el rol a dar cuando el usuario entre")
        .setRequired(false)
        ).addStringOption((option) =>
        option
          .setName("image")
          .setDescription("Deja el link del imagen")
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
    let channel = interaction.options.getChannel("channel");

    let message = interaction.options.getString("message");

    let image = interaction.options.getString("image") || null;

    let embed = interaction.options.getBoolean("embed");

    let role = interaction.options.getRole("role") || null;

    async function httpsResult(str) {
      let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      if(regexp.test(str)) {
        return true;
      } else {
        return false;
      }
    }

    if(httpsResult(image) === false)return interaction.reply({content:"En la parte de imagen debes poner un link"})

    console.log(role)

    const datos = await welSchema.findOne({guildId: interaction.guild.id })
    if(!datos){
      if(role === null){
        let newDatosNoRol = new welSchema({
          guildId: interaction.guild.id,
          channelId: channel.id,
          linkImage: image,
          message: message,
          messageEmbed: embed,
          roleId: null
        })

        await newDatosNoRol.save()

        return interaction.reply({content:"Bienvenidas puesta!"});
      }

      let newDatos = new welSchema({
        guildId: interaction.guild.id,
        channelId: channel.id,
        linkImage: image,
        message: message,
        messageEmbed: embed,
        roleId: role.id
      })

      await newDatos.save()

      interaction.reply({content:"Bienvenidas puesta!"})
    }
  },
};
