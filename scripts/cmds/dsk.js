const axios = require("axios");

async function getMessage(yourMessage, langCode) {
  const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
      'text': yourMessage,
      'lc': langCode
    })
  );

  if (res.status !== 200) {
    throw new Error(res.data.success);
  }

  return res.data.message;
}

module.exports = {
  config: {
    name: "dsk",
    aliases: ["sim", "simi"],
    version: "1.5",
    author: "tanvir",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "get a response from SimSimi"
    },
    longDescription: {
      en: "get a response from SimSimi"
    },
    category: "SimSimi"
  },

  onStart: async function ({ message, event, args, commandName, usersData, api }) {
    const prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please provide a prompt.");
      return;
    }

    try {
      const Msg = await getMessage(prompt, 'bn');

      const replyOptions = {
        body: Msg
      };

      message.reply(replyOptions, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args, usersData, api }) {
    let { author, commandName, messageID } = Reply;
    if (event.senderID !== author) return;

    try {
      const Msg = await getMessage(args.join(" "), 'bn');

      const replyOptions = {
        body: Msg
      };

      message.reply(replyOptions, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};