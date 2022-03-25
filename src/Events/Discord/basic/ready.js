module.exports = {
  name: "ready",
  async execute(client) {
    console.log(`Logeado en ${client.user.username}`);

    let activities = [
      {
        type: "WATCHING",
        name: "Visita nuestro support",
      },
      {
        type: "PLAYING",
        name: `${client.guilds.cache.size} severs`,
      },
      {
        type: "COMPETING",
        name: "Verification",
      },
      {
        type: "LISTENING",
        name: `${client.users.cache.size} miembros`
      },
      {
        type: "PLAYING",
        name: "/bot-info"
      }
    ];

    setInterval(() => {
     let randomAct = activities[Math.floor(Math.random() * activities.length)];

      async function presence() {
        client.user.setPresence({
          activities: [randomAct],
          status: "online",
        });
      }
      presence()
    }, 120000);

    //setInterval(() => {
      //async function vigilar() {
        //console.log(
          //`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB `
        //);
      //}
      //vigilar();
    //}, 120000);
  },
};
