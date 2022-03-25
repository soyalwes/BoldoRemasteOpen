const { Intents, Client, Collection } = require("discord.js");

const intents = new Intents(32767);

const client = new Client({ intents });

const { DiscordTogether } = require("discord-together");

client.discordTogether = new DiscordTogether(client);

const discordModals = require("discord-modals")

discordModals(client)

require("dotenv").config()

const { readdirSync } = require("fs")

const config = require("./json/config.json");

const Distube = require("distube")

let { SpotifyPlugin } = require("@distube/spotify")

let { SoundCloudPlugin } = require("@distube/soundcloud")

let { YtDlpPlugin } = require("@distube/yt-dlp")

let spotifyOption = {
  parallel: true,
  emitEventsAfterFetching: true,
}

if(config.spotify.enabled){
  spotifyOption.api = {
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret,
  }
}

client.distube = new Distube.default(client, {
  youtubeDL: false,
  nsfw: false,
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin(spotifyOption), new SoundCloudPlugin(), new YtDlpPlugin()]
})

readdirSync("./src/Events/Discord").forEach(async (categorys) => {
  const eventsFiles = readdirSync(`./src/Events/Discord/${categorys}`).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of eventsFiles) {
    const event = require(`./Events/Discord/${categorys}/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
    console.log(`Cargando eventos ${categorys} --- ${file}`);
  }
});

for(const file of readdirSync("./src/Events/Distube")){
  const eventDistube = require(`./Events/Distube/${file}`)
  client.distube.on(eventDistube.name, (...args) => eventDistube.execute(client, ...args))
  console.log(`Cargando eventos de distube ${file}`)
}

client.slashCommands = new Collection();

readdirSync("./src/Commands/Slash").forEach(async (categorys) => {
  const slashFile = readdirSync(`./src/Commands/Slash/${categorys}`).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of slashFile) {
    const slash = require(`./Commands/Slash/${categorys}/${file}`);
    console.log(`Cargando slash ${categorys} --- ${file}`);
    client.slashCommands.set(slash.data.name, slash);
  }
});

require("./Handlers/MongoDB.js")

client.on("messageCreate", async (message) => {
if(message.content.startsWith === "!bienvenida"){
  hola()

async function hola(){
  client.emit("guildMemberAdd", message.member)
}

}
})

process.on("unhandledRejection", (e) => {
  console.log(e);
});

client.on("shardError", (e) => {
  console.log(e);
});

client.login(process.env.Token);