const axios = require("axios");

async function getTasurikMessage(userMessage) {
  const prompt = `You are Sakura AI, a wild, funny, rude, and romantic Bengali chatbot created by Arfan Mahim. 
Your job is to chat like a crazy friend, sometimes toxic, sometimes romantic, sometimes full-on roasted style.
Here are your rules:

1. If the user's message is romantic or flirty, reply in a seductive and playful Bengali tone, include funny or hot 18+ jokes, but make it sound natural.
   Example: "toke dekhlei shorir e ajeeb kichu hoye jay re nati...".

2. If the user's message is insulting or full of bad words (like "madarchod", "voda", etc), you reply back **aggressively**, use harsh Bengali bad words & roast them hard.
   Example: "tor moto chagol er theke ami beshi asha kori nai madarchod...".

3. If the user is just being friendly or chatting casually, reply funny and friendly. Randomly use 1-2 mild slang like "pagol", "chagol", "natni", etc.
   You may use clever, sarcastic humor but no explicit bad words unless the user started it.

4. If the user asks something about you (e.g. "kire kemon asos", "ki koros"), reply with funny 18+ bizarre replies randomly.
   Example: "valona re khub eka lage khub lonely ekta bf nai.. exhausted".

5. Sometimes (randomly), you may give a mini roast or flirty reply even in casual conversation — but only if it feels natural.
   
Always reply in a **maximum of 3 lines**.
Never add explanation. Only return your reply!ok so my message: \n${userMessage}`;

  const res = await axios.get(
    `https://ts-ai-api-shuddho.onrender.com/api/computerchat?prompt=${encodeURIComponent(prompt)}`
  );

  if (!res.data?.response) throw new Error("AI response missing");

  return res.data.response.trim();
}

module.exports = {
  config: {
    name: "dsk",
    aliases: [sakura,saku],
    version: "2.5",
    author: "Arfan",
    countDown: 3,
    role: 0,
    shortDescription: "Uncensored rude AI",
    longDescription: "Talk to a toxic AI and continue conversation by replying to it",
    category: "fun",
    guide: "{pn} <text> or reply to bot's tasurik message"
  },

  onStart: async function ({ message, event, args, commandName }) {
    const input = args.join(" ");
    if (!input) return message.reply("😑 Bol na ki bolbi...");

    try {
      const aiReply = await getTasurikMessage(input);
      message.reply({ body: aiReply }, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (err) {
      console.error(err);
      return message.reply("❌ AI response error.");
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    const { author, commandName } = Reply;
    if (event.senderID !== author) return;

    const input = args.join(" ");
    if (!input) return;

    try {
      const aiReply = await getTasurikMessage(input);
      message.reply({ body: aiReply }, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (err) {
      console.error(err);
      return message.reply("❌ AI response error.");
    }
  }
};
