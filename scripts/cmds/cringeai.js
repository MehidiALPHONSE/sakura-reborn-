const axios = require('axios');

async function a(api, event, args, message) {
  try {
    const a = args.join(" ").trim();

    if (!a) {
      return message.reply("write something dumbass");
    }

    const b = "you are funny ai. you will answer everything in a funny way.your name is cringelord😎 and you are created by ぎゆ 富岡. never repeat your messages send new messages everytime.don't greet the user and you can use some curses in your messages. keep your messages short. your job is to entertain the user.";
    const c = await d(a, b);

    if (c.code === 2 && c.message === "success") {
      message.reply(c.answer, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      message.reply("Please try again later.");
    }
  } catch (e) {
    console.error("Error:", e);
    message.reply("An error occurred while processing your request.");
  }
}

async function d(a, b) {
  try {
    const d = await axios.get(`https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(a)}&content=${encodeURIComponent(b)}`);
    return d.data;
  } catch (f) {
    console.error("Error from api", f.message);
    throw f;
  }
}

module.exports = {
  config: {
    name: "cringeai",// add your ai name here
    aliases: ["crai"],
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    longDescription: "Meh",// ai description
    category: "ai",
    guide: {
      en: "{p}cringeai [prompt]"// add guide based on your ai name
    }
  },
  
  handleCommand: a,
  onStart: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  }
};