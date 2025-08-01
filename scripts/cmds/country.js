const fs = require('fs');

module.exports = {
  config: {
    name: "country",
    aliases: ["flag"],
    version: "1.2",
    author: "mahim",
    countDown: 10,
    role: 0,
    shortDescription: {
      vi: "",
      en: "guess the country name"
    },
    longDescription: {
      vi: "",
      en: "game"
    },
    category: "games",
    guide: {
      en: "{pn}"
    }
  },
  langs: {
    en: {
      reply: "Reply with the name of a country",
      correct: "Correct answer. You won %1$ 💰",
      wrong: "Wrong answer❌" // delete if you want to disable warning for incorrect answers
    }
  },
  onStart: async function ({ message, event, commandName, envCommands, getLang, usersData }) {
    const reward = {
      coin: Math.floor(Math.random() * (300 - 80 + 1) + 80)
    };

    const json = JSON.parse(fs.readFileSync('emoji.json'));
    const Qdata = json[Math.floor(Math.random() * json.length)];

    const link = Qdata.link;
    const answer = Qdata.emoji.split(',')[0].trim(); // Extract the country name from the "emoji" string

    message.reply({
      body: getLang("reply"),
      attachment: await global.utils.getStreamFromURL(link)
    }, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        answer: answer,
        reward: reward
      });
    });
  },
  onReply: async function ({ message, Reply, event, getLang, usersData, envCommands, commandName }) {
    const { author, messageID, answer, reward } = Reply;
    const { senderID } = event;

    if (formatText(event.body) === formatText(answer)) {
      global.GoatBot.onReply.delete(messageID);
      message.unsend(event.messageReply.messageID);

      const userData = await usersData.get(senderID);
      const getCoin = reward.coin;
      

      await usersData.set(senderID, {
        money: userData.money + getCoin,
        
        data: userData.data
      });

      message.reply(getLang("correct", getCoin));
    } else {
      message.reply(getLang("wrong"));
    }
  }
};

function formatText(text) {
  return text.normalize("NFD").toLowerCase();
}
