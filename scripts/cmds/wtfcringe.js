const fs = require('fs');
module.exports = {
  config: {
    name: "cringe",
    version: "1.0",
    author: "Batman",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "useless",
  },
  onStart: async function(){},
  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "cringe") {
      return message.reply({
        body: "shikanoko nokonoko koshitantan",
        attachment: fs.createReadStream("CRINGE.mp4"),
      });
    }
  }
};