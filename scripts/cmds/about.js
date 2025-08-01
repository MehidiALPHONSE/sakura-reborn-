const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "about",
    version: "1.0",
    author: "Mahim",
    countDown: 60,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "owner",
    guide: {
      en: ""
    },
    envConfig: {}
  },

  onStart: async function ({ message }) {
    const botName = "Sakura~";
    const botPrefix = "-";
    const authorName = "Arfan";
    const teamName = "ArchitectDevs";
    const authorFB = "https://www.facebook.com/MehidiHassanMahimOfficial";
    const authorInsta = "secrate";

    const urls = JSON.parse(fs.readFileSync('info.json'));
    const link = urls[Math.floor(Math.random() * urls.length)];

    const now = moment().tz('Asia/Dhaka');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    message.reply({
      body: `===「 Bot & Owner Info 」===\n♡ Bot Name: ${botName}\n♡ Bot Prefix: ${botPrefix}\n♡ Name: ${authorName}\n♡ Facebook: ${authorFB}\n♡ Instagram: ${authorInsta}\n♡ Date: ${date}\n♡ Time: ${time}\n♡ Team:${teamName}\n♡ Uptime: ${uptimeString}\n=====================`,
      attachment: await global.utils.getStreamFromURL(link)
    });
  },

  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "about") {
      this.onStart({ message });
    }
  }
};
