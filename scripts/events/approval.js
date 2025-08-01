const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "approval",
    version: "1.2",
    author: "rulex/Loufi",
    shortDescription: {
      en: "approval mode by loufi",
      vi: "Rời khỏi tất cả các nhóm trừ những nhóm được liệt kê trong threads.json"
    },
    longDescription: {
      en: "Leaves all groups except those in threads.json and sends a message to the owner of the bot",
      vi: "Rời khỏi tất cả các nhóm trừ những nhóm được liệt kê trong threads.json và gửi một tin nhắn cho chủ sở hữu của thread ID 4"
    },
    category: "developer"
  },
  onStart: async function ({ api, event, threadsData, message }) {
    const uid = "100004252636599";

    const groupId = event.threadID;
    const threadData = await threadsData.get(groupId);
    const name = threadData.threadName;

    let threads = [];
    try {
      threads = JSON.parse(fs.readFileSync('threads.json'));
    } catch (err) {
      console.error('', err);
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await message.send({
        body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - https://m.me/j/AbZd6HddcyXHEFki/\nor type -supportgc within 20 second ⏳\nJoin Support GC To Get Approval To Use Sakura!\n\n- ArchitectDevs`,
        attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
      });
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await new Promise((resolve) => setTimeout(resolve, 20000)); // Delay of 1 seconds
      await api.sendMessage(
        `✅ | This group needs approval\n🆔 | TID: ${groupId}\n🍁 | TName: ${name}\n\n☣️ | Master Approve it when you see..`,
        uid,
        async () => {
          await api.removeUserFromGroup(api.getCurrentUserID(), groupId);
        }
      );
    }
  }
};
