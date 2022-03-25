const { SlashCommandBuilder } = require("@discordjs/builders");
const ticketSchema = require("../../../Schema/ticket-schema.js");
const Permissions = require("../../../json/Permissions.json");
const { NoData } = require("../../../json/ErrorMessage.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("ticket-set-staff").setDescription("Modifica el staff de los tickets")
  .addRoleOption((option) =>
    option
    .setName("role")
    .setDescription("Elije el rol de staff")
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

    const role = interaction.options.getRole("role") || null

    let permsBot = interaction.guild.me.permissions.has(Permissions.AD.Perm);
    if (!permsBot)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissionsBot}\nPermiso: ${Permissions.AD.MessagePerms}`,
      });

    let perms = interaction.member.permissions.has();
    if (!perms)
      return interaction.reply({
        content: `${Permissions.MessageNoPermissions}\nPermiso: ${Permissions.AD.MessagePerms}`,    
      });

      if(role === null){
      
        const datos = await ticketSchema.findOne({ guildId: interaction.guild.id })
    
        if(!datos)return interaction.reply({content: NoData })
    
        await ticketSchema.findOneAndUpdate({guildId: interaction.guild.id, staffRolId: role})
        }

    const datos = await ticketSchema.findOne({ guildId: interaction.guild.id })

    if(!datos)return interaction.reply({content: NoData })

    await ticketSchema.findOneAndUpdate({guildId: interaction.guild.id, staffRolId: role.id})

    interaction.reply({content: `Datos actualizado, ahora ${role.name} sera el rol de tickets`})
  },
};