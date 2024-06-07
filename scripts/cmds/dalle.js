const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.0",
    author: "rehat--",
    role: 0,
    countDown: 5,
    longDescription: {
      en: "Generate images using dalle 3"
    },
    category: "ai",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    const keySearch = args.join(" ");
if (!keySearch) return message.reply("Add something baka.");
    message.reply("Please wait...⏳");

    try {
        const res = await axios.get(`https://api-turtle.onrender.com/api/dalle?prompt=${keySearch}&cookie=1asUMtr4Dzbtvp3qBW4Fw3BlJwSCoCzy1EwrI7kaBywYZM63RQlKJ9yeKzeEczD2GJ6x4E9UOnXT2NelM_BuSOB5x9-KLwzYHkbItDxWlKz-vB8F24Kf4zUskUbGIHvrHNTUV5K3IqktCA29giNbOTv3Ids3Baa7hr6QJEWg5Z7hHVvmjs5DRGTfthRlIAiPPO9TSb0gj0py6foM8nhcaO8fJsFBzAhBT4c0h7ETzM1A`);// add your bing cookie _u value!!
        const data = res.data.result

        if (!data || data.length === 0) {
            api.sendMessage("An error occurred.", event.threadID, event.messageID);
            return;
        }

        const imgData = [];
        for (let i = 0; i < data.length; i++) { // No need to limit to Math.min(numberSearch, data.length)
            const imgUrl = data[i];
            const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            attachment: imgData,
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred.", event.threadID, event.messageID);
    } finally {
        await fs.remove(path.join(__dirname, 'cache'));
    }
  }
}