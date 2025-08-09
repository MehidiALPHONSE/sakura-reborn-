const axios = require("axios");

module.exports = {
  config: {
    name: "t2i",
    aliases: ["imagine"],
    version: "1.0",
    author: "Arfan",
    countDown: 25,
    role: 0,
    shortDescription: "Generate image from text",
    longDescription: "Generate an image from your text prompt using AI",
    category: "image",
    guide: "{pn} <prompt>"
  },

  langs: {
    en: {
      processing: "Your Request On process... ⏳",
      error: "❌ An error occurred. Please try again later.",
      done: "✅ Image generated in {time} seconds"
    }
  },

  onStart: async function({ message, args, getLang, api }) {
    if (!args.length) {
      return message.reply("❌ Please enter a prompt to generate image.");
    }

    const prompt = args.join(" ");
    const loadingMsg = await message.reply(getLang("processing"));

    try {
      const start = Date.now();

      const response = await axios.get("https://ts-ai-api-shuddho.onrender.com/api/imaginev2", {
        params: { prompt }
      });

      const data = response.data;

      if (!data.response) {
        await api.unsendMessage(loadingMsg.messageID);
        return message.reply(getLang("error"));
      }

      const stream = await global.utils.getStreamFromURL(data.response);

      if (!stream) {
        await api.unsendMessage(loadingMsg.messageID);
        return message.reply(getLang("error"));
      }

      const end = Date.now();
      const seconds = ((end - start) / 1000).toFixed(2);

      await api.unsendMessage(loadingMsg.messageID);

      return message.reply({
        body: getLang("done").replace("{time}", seconds),
        attachment: stream
      });

    } catch (error) {
      console.error("Error in t2i command:", error);
      await api.unsendMessage(loadingMsg.messageID);
      return message.reply(getLang("error"));
    }
  }
};
