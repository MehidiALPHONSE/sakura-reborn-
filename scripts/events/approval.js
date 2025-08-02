const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const threadsFile = 'threads.json';
  const supportGCLink = "https://m.me/j/AbZd6HddcyXHEFki/";
  const botID = api.getCurrentUserID();
  const groupID = event.threadID;

  // Load approved threads
  let approvedThreads = [];
  try {
    approvedThreads = JSON.parse(fs.readFileSync(threadsFile));
  } catch (err) {
    approvedThreads = [];
  }

  // Check if this group is approved
  if (!approvedThreads.includes(groupID)) {
    // Warn message
    await api.sendMessage({
      body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - ${supportGCLink}\nPlease join the support group for approval.`,
      attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
    }, groupID);

    // Wait 20 seconds then leave
    setTimeout(async () => {
      try {
        await api.removeUserFromGroup(botID, groupID);
      } catch (error) {
        console.log("Leave error:", error);
      }
    }, 20000);
  }
};
