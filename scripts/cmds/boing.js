const fs = require('fs');
module.exports = {
  config: {
    name: "boing",
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
    if (event.body && event.body.toLowerCase() === "boing") {
      return message.reply({
        body: "boing boing😗",
        attachment: fs.createReadStream("boing.mp3"),
      });
    }
  }
};