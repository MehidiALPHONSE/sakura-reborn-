const fs = require("fs");

const globalData = {
  fff: [],
};

module.exports = {
  config: {
    name: "pokemon",
    aliases: [],
    version: "1.2",
    author: " modified By Arfan",
    countDown: 25,
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

      const form = {
        body: "🐍 A wild Pokémon appeared!\n\nReply with the correct Pokémon name to get reward!",
        attachment: await global.utils.getStreamFromURL(pokos[ind].image),
      };

      message.reply(form, (err, info) => {
        if (err) return;

        globalData.fff.push(info.messageID);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "pokemon",
          mid: info.messageID,
          name: pokos[ind].name,
          ind: ind,
        });
      });
    } catch (e) {
      console.error("❌ Error in onStart:", e);
      message.reply("An error occurred. Please try again later.");
    }
  },

  onReply: async ({ event, api, Reply, message, usersData }) => {
    try {
      const userId = event.senderID;
      const input = event.body.toLowerCase();
      const answer = Reply.name.toLowerCase();

      if (input === answer || input === answer.split("-")[0]) {
        const rewardCoins = 1000;
        const rewardExp = 10;

        const userData = await usersData.get(userId);
        await usersData.set(userId, {
          money: userData.money + rewardCoins,
          exp: userData.exp + rewardExp,
          data: userData.data,
        });

        const properName = Reply.name.charAt(0).toUpperCase() + Reply.name.slice(1);
        message.reply(`🎉 Correct! The Pokémon is ${properName}.\nYou've earned 💰 $${rewardCoins} and ✨ ${rewardExp} EXP!`);

        api.unsendMessage(Reply.mid);
      } else {
        message.reply("❌ Wrong answer.");
      }
    } catch (e) {
      console.error("❌ Error in onReply:", e);
      message.reply("An error occurred. Please try again later.");
    }
  },
};

function getRandomInt(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandom(arr, exclude) {
  let rand;
  do {
    rand = getRandomInt(arr);
  } while (Array.isArray(exclude) && exclude.includes(rand));
  return rand;
}
