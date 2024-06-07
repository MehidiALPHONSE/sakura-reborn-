const fs = require('fs');
module.exports = {
  config: {
    name: "meow",
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
    if (event.body && event.body.toLowerCase() === "meow") {
      return message.reply({
        body: "meow meow🐱",
        attachment: fs.createReadStream("meow.mp3"),
      });
    }
  }
};