const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "approval",
    version: "1.3",
    author: "Arfan",
    shortDescription: {
      en: "Leave groups without approval (manual threads.json)"
    },
    category: "developer"
  },

  onStart: async function ({ api, event }) {
    const masterUID = "100004252636599"; // আপনার মাস্টার ID
    const groupId = event.threadID;

    if (event.logMessageType !== "log:subscribe") return;

    let threads = [];
    try {
      threads = JSON.parse(fs.readFileSync('threads.json'));
    } catch (e) {
      console.error("Failed to load threads.json:", e);
      return;
    }

    if (!threads.includes(groupId)) {
      const groupName = groupId; // যদি নাম না লাগে, নামও নিতে পারো api দিয়ে

      await api.sendMessage({
        body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - https://m.me/j/AbZd6HddcyXHEFki/\nPlease join support GC for approval.`,
        attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
      }, groupId);

      // ২০ সেকেন্ড অপেক্ষা
      await new Promise(r => setTimeout(r, 20000));

      await api.sendMessage(
        `✅ | Unapproved group tried to add bot\n🆔 | TID: ${groupId}\n\n☣️ | Please approve if needed.`,
        masterUID
      );

      const botID = api.getCurrentUserID();
      await api.removeUserFromGroup(botID, groupId);
    }
  }
};
