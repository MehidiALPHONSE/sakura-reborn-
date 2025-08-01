const fs = require('fs');

module.exports = {
  config: {
    name: "approval",
    version: "1.3",
    author: "Arfan",
    category: "developer",
    shortDescription: {
      en: "Leave unapproved groups (checks threads.json)"
    }
  },

  onStart: async function ({ api, event }) {
    const masterUID = "100004252636599"; // তোমার মাস্টার আইডি
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
      // Unapproved group এড করলে মেসেজ পাঠাবে
      await api.sendMessage({
        body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - https://m.me/j/AbZd6HddcyXHEFki/\nPlease join the support group for approval.`
      }, groupId);

      // ২০ সেকেন্ড অপেক্ষা করবে তারপর মাস্টারকে জানাবে এবং বট গ্রুপ থেকে বের হয়ে যাবে
      await new Promise(r => setTimeout(r, 20000));

      const threadData = await api.getThreadInfo(groupId);
      const groupName = threadData.threadName;

      await api.sendMessage(
        `✅ | Unapproved group tried to add bot\n🆔 | TID: ${groupId}\n🍁 | Name: ${groupName}\n\n☣️ | Please approve if needed.`,
        masterUID
      );

      const botID = api.getCurrentUserID();
      await api.removeUserFromGroup(botID, groupId);
    }
  }
};
