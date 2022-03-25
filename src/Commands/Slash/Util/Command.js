const { SlashCommandBuilder } = require("@discordjs/builders");
const toggle = require("../../../Schema/togglecmd-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("command")
    .setDescription("quita o pon comandos")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("on")
        .setDescription("Pon comandos que esten en la blacklist")
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("Di el comando a activar")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("off")
        .setDescription("quita comandos y ponlos en la blacklist")
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("Di el comando a desactivar")
            .setRequired(true)
        )
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

    let perms = interaction.member.permissions.has("ADMINISTRATOR");
    if (!perms)
      return interaction.reply({
        content: "No tienes los permisos suficientes\nPermiso: administrador",
      });

      const command = interaction.options.getString("command");

      if(command === "command")return interaction.reply({content:"No se puede desactivar este comando"})

    if (interaction.options.getSubcommand() === "off") {
      const cmd = `${command}.js`

      if (!client.slashCommands.get(cmd) === false)
        return interaction.reply({ content: "Ese comando no existe" });

      let datos = await toggle.findOne({ guildId: interaction.guild.id });
      if (!datos) {
        let newDatos = new toggle({
          guildId: interaction.guild.id,
          Comando: [],
        });
        await newDatos.save();

        return interaction.reply({
          content: "Los datos estan siendo guardados usa el comando de nuevo",
        });
      }

      if (datos.Comando.includes(command))
        return interaction.reply({
          content: "Ese comando ya esta desactivado",
        });

        await toggle.findOneAndUpdate({guildId: interaction.guild.id}, { $push: { Comando: command}})

      interaction.reply({
        content: `El comando ${command} fue desactivado correctamente`,
      });
    }
    if (interaction.options.getSubcommand() === "on") {
      let cmd = `${command}.js`

      if (!client.slashCommands.get(`${cmd}`) === false)
        return interaction.reply({ content: "Ese comando no existe" });

      let datos = await toggle.findOne({ guildId: interaction.guild.id });
      if (!datos) {
        let newDatos = new toggle({
          guildId: interaction.guild.id,
          Comando: [],
        });
        await newDatos.save();

        return interaction.reply({
          content: "Los datos estan siendo guardados usa el comando de nuevo",
        });
      }

      if (!datos.Comando.includes(command))
        return interaction.reply({ content: "Ese comando no esta apagado" });

      if (datos.Comando.includes(command)) {
        let commandNumber;

        for (let i = 0; i < datos.Comando.length; i++) {
          if (datos.Comando[i] === command) datos.Comando.splice(i, 1);
        }
        await datos.save();

        interaction.reply({content:`El comando ${command} fue activado`})
      }
    }
  },
};
