const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch")
const color = require("../../../json/Color.json")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("memes").setDescription("Ve un meme"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply("Estas en cooldown");

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const Reddits = [
        "MAAU",
        "DylanteroYT"
    ];

    const RedditsRandom = Reddits[Math.floor(Math.random() * Reddits.length)]

    const res = await fetch(`https://www.reddit.com/r/${RedditsRandom}/random/.json`)

    const json = await res.json();

    if(!json) return interaction.reply({content: "Usa de nuevo el comando"})

    const data = json[0].data.children[0].data;

    if(data.media !== null){
      return interaction.reply({content:`${data.title}\nAuthor: ${data.author}\nSubReddit: ${data.subreddit_name_prefixed}\n${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬\n${data.media.reddit_video.fallback_url}\npd: el meme o video por problemas del code no se escucha`})
    } else {
      interaction.reply({content:`${data.title}\nAuthor: ${data.author}\nSubReddit: ${data.subreddit_name_prefixed}\n${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬\n${data.url}`})
    }
  },
};