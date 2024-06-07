const axios = require("axios").default;

module.exports = {
  config: {
    name: "ocr",
    version: "1.0",
    author: "JARiF@Cock",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: "Get text from an image",
    longDescription: "",
    guide: {
      en: "{pn} reply to an image to extract text",
    },
  },

  onStart: async function ({ api, message, event }) {
    if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
      const imageUrl = event.messageReply.attachments[0].url;
      const wait = await message.reply("✅ | Please wait...");
      const data = {
        imageUrl: imageUrl 
      };

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await axios.post('https://api.vyturex.com/ocr', data, config);
        await api.unsendMessage(wait.messageID);
        message.reply(response.data.text);
      } catch (error) {
        message.reply('Error: ' + error.message); 
      }
    }
  }
};