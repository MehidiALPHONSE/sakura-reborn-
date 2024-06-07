const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACKBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACPD0hIirQVlqSAQ89cKsZI+l67zWSJn5fDh7UmnqSNz3CFeiXKPmcZjYnh5iulg6xMw810Wq0tsLsehIJJSaZqAUv+envPY9lPvIdAyhFwSKcnzGIDSbporncX0IDEO0DidETdbzIUzBzgIO/gmL52WAe/+TmtIDCEGfsiAYCnokoLumvqu3dJ0RTUsmau5D7IxeaDEoUj7bk4omxpC+4LOj3ZAhSw/ZyMLqowWjaUmFhUX9YkFp4Iw8NdfsKxF43USJsPKzIxaERyxDBevD+9VxITNxafeExpbbPTicw5UqBNrpGvFR+JFZ5Jaih1aqb8xseD0l0N+BpG/110JzW1I/LKU+I3GIrA2MflckMZeVYTImbamyIURCzyL7yNn2AosaonoJVuYQ7aPsgtYt9jt9VqfKkM9ACxVvcPRZs8I5BiLDQ14km9SlFOusZw7wgJMZ8SljdclaHG2COozlBDR9AaejHNsbD3HbP3KseqpOyDE7TFwd66qv9o0eZSAqWLGmBOXVdAx4FZO9zdtoAMvxVafllH4+nC7DK6ASCnMx2J+Pphvsv2XIVuNH4uGjoBq9RsyBhSA96KRx2jPzpJxly51KZnEBzqSalScVMneGgX5eNBSUdP4xNX9G3++sOPlWmQJyBTWUWZIK3NOT8xJtbhNsj6orqj8VDWK77IXqY+MLOFiCNCBUu5aDd0ZBUGCWxVCvMDz8a6WYy0qC3lv13D5haL6sHCaE800M0gp2j6yfOQtXk4d64wSmaA/F9Xv8FHPK0F1tNQ5pPVsKRLlxnpaoxavQV1+OHowaenYT1ylOVwcG920HWjN3+lIv1n1v1iTRUOBSiPIbBG4Wgz9qGjg/9ZG9pBS39oYL6NgPWsjwndtAu1FYOdWgNkdaMilvBA8JVf8i3fYjqhNkVMaOYgMUwvh8VGJCZK54zgvmoWdT+hgZxzIpN6kGZmZ6j8dE8vUXVAB4cKlOjQc/zi64S8+MCnTnXhGkDdGca6J6PkcS7OGmy/SCqjWHN2xSBBTjwMEC5KKc6UndGwVwUFGRd/XU68R8MY3IH4SsEbg/vnv+RetyAI62N8g9cEJTVLsyOSYsP7cxIWENUXu5bGbROTlHo6Nm3PDwZuBvbxAcehxM2Lh7ksRTufCmV14arSECYbWvlFFkCljEIY10ZG/34IxS3jebZgRAnAAP6pk1ofM99Rsx7fxJvnEJIPWEdomd3e+D0rIp3XU/y3wlsdl0LnCPiRsF027w4KuWnsoHq16EZJjyNLhQge9Ah4LRkrYwxRL4ZxI+xa46IWqwU6swa6fMdf8XeA5v4uo4DzdEOJmV9nNJSgL4Mp3H/1JxDjp1gbpCQKHVBxAsx3XNZDQPNX1lr5xPNrmCpcA4lH/dDuVuQgad9bRW4MUKusM5O/pFSB/YfOtDIRz4OD5SGZ1kwoMNvgEsaylLcN4/FJsQwLOl2k/I2shyDUu2ujZBvDB+FACS7sqTKX4Upc1XMbsFWiFDNLS1kA==";
const _U = "1asUMtr4Dzbtvp3qBW4Fw3BlJwSCoCzy1EwrI7kaBywYZM63RQlKJ9yeKzeEczD2GJ6x4E9UOnXT2NelM_BuSOB5x9-KLwzYHkbItDxWlKz-vB8F24Kf4zUskUbGIHvrHNTUV5K3IqktCA29giNbOTv3Ids3Baa7hr6QJEWg5Z7hHVvmjs5DRGTfthRlIAiPPO9TSb0gj0py6foM8nhcaO8fJsFBzAhBT4c0h7ETzM1A";

module.exports = {
  config: {
    name: "dalle3",
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: { en: "dalle3 image generator" },
    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },
    category: "ai",
    guide: { en: "{prefix}dalle <search query>" }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    try {
      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);
        return;
      }

      const imgData = [];

      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);
    }
  }
};