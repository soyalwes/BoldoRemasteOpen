const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const slashCommands = [];
const { readdirSync } = require("fs");
const { config } = require("dotenv")

config();


console.log("Cargandos los slashes");

readdirSync("./src/Commands/Slash").forEach(async (categorys) => {
  const slashFile = readdirSync(`./src/Commands/Slash/${categorys}`).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of slashFile) {
    const slash = require(`../Commands/Slash/${categorys}/${file}`);
    console.log("Analizando Slash " + file);
    slashCommands.push(slash.data.toJSON());
  }
});

const rest = new REST({ version: "9" }).setToken(process.env.Token);

createSlash();

async function createSlash() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.clientId), {
        body: slashCommands
      }
    )
    console.log("Cargados Slash");
  } catch (error) {
    console.log(error);
  }
}
