const fs = require("fs");

const globalData = {
  fff: [],
};

module.exports = {
  config: {
    name: "pokespawn",
    aliases: "",
    version: "1.2",
    author: "Shikaki\nPokemon data: Ausum",
    countDown: 10,
    role: 0,
    shortDescription: "Spawn a Pokémon",
    longDescription: "Spawn a pokemon, reply correct name, get money and exp",
    category: "game",
    guide: "{pn}",
  },

  onStart: async function ({ message, event }) {
    try {
      const pokos = JSON.parse(fs.readFileSync('pokos.json', 'utf8'));

      const ind = getRandom(pokos, []);
      try {
        const form = {
          body: "🐍 A wild Pokémon appeared!\n\nGet free coins and exp by replying with the correct Pokémon name.",
          attachment: await global.utils.getStreamFromURL(pokos[ind].image),
        };
        message.reply(form, (err, info) => {
          globalData.fff.push(info.messageID);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "pokespawn",
            mid: info.messageID,
            name: pokos[ind].name,
            ind: ind,
          });

          setTimeout(() => {}, 1000);
        });
      } catch (e) {
        console.error("Error in pokespawn:", e);
        message.reply('Server busy. Please try again later.');
      }
    } catch (error) {
      console.error("Error in pokespawn:", error);
      message.reply("An error occurred. Please try again later.");
    }
  },

  onReply: async ({ event, api, Reply, message, getLang, usersData }) => {
    try {
      const pokos = JSON.parse(fs.readFileSync("pokos.json", "utf8"));

      const userId = event.senderID;
      const lowerCaseUserInput = event.body.toLowerCase();
      const lowerCaseReplyName = Reply.name.toLowerCase();

      if (lowerCaseReplyName == lowerCaseUserInput || lowerCaseReplyName.split("-")[0] == lowerCaseUserInput) {
        const rewardCoins = 1000;
        const rewardExp = 10;

        const userData = await usersData.get(userId);
        await usersData.set(userId, {
          money: userData.money + rewardCoins,
          exp: userData.exp + rewardExp,
          data: userData.data,
        });

        const capitalizedName = Reply.name.charAt(0).toUpperCase() + Reply.name.slice(1);

        message.reply(`📣 Congratulations! You guessed the Pokémon ${capitalizedName} correctly.\n\nYou've been rewarded with $${rewardCoins} and ${rewardExp} exp.`);

        api.unsendMessage(Reply.mid);
      } else {
        message.reply("❌ Wrong answer.");
      }
    } catch (error) {
      console.error("Error in onReply:", error);
      message.reply("An error occurred. Please try again later.");
    }
  },
};

function getRandomInt(arra) {
  return Math.floor(Math.random() * arra.length);
}

function getRandom(arra, excludeArrayNumbers) {
  let randomNumber;

  if (!Array.isArray(excludeArrayNumbers)) {
    randomNumber = getRandomInt(arra);
    return randomNumber;
  }

  do {
    randomNumber = getRandomInt(arra);
  } while ((excludeArrayNumbers || []).includes(randomNumber));

  return randomNumber;
}
