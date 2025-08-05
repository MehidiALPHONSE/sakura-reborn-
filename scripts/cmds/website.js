const fs = require('fs');
module.exports = {
  config: {
    name: "website",
    version: "1.0",
    author: "Arfan",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "no prefix",
  },
  onStart: async function(){},
  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "website") {
      return message.reply({
        body: "https://sakura-architectdevs.vercel.app",
        
      });
    }
  }
};
