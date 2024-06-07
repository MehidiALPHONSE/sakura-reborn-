const axios = require('axios');

module.exports = {
  config: {
    name: "imagine",
    version: "1.1",
    author: "Arfan Mahim",
    countDown: 10,
    shortDescription: {
      en: "Image Generator"
    },
    longDescription: {
      en: "Create image from your text, from your imagination!"
    },
    category: "ai",
    role: 0,
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
  const promptPart = args.join(" ");

  if (!promptPart) return message.reply("Add something baka");

  message.reply("✅| Creating your Imagination...", async (err, info) => {
    let ui = info.messageID;

    try {
      let apiUrl =`https://ts-ai-api-shuddho.onrender.com/api/imaginev2?prompt=${encodeURIComponent(promptPart)}`;

      const response = await axios.get(apiUrl);
      const img = response.data.response;
      message.unsend(ui); // Unsend the "Creating your Imagination" message

      const stream = await global.utils.getStreamFromURL(img);

      
      message.reply({
        body: "Here's your imagination 🖼.",
        attachment: stream,
      }, async (err, info) => {
        if (err) return console.error(err);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(event.threadID);
    }
  });
},

};