const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const threadsFile = 'threads.json';
  const supportGCLink = "https://m.me/j/AbZd6HddcyXHEFki/";
  const botID = api.getCurrentUserID();
  const groupID = event.threadID;

  // OWNER ID -- ei ID te notify jabe
  const ownerID = "100004252636599"; // 🔁 Eta replace kore tmr main ID diba

  // Load approved threads
  let approvedThreads = [];
  try {
    approvedThreads = JSON.parse(fs.readFileSync(threadsFile));
  } catch (err) {
    approvedThreads = [];
  }

  // Check if not approved
  if (!approvedThreads.includes(groupID)) {
    // Step 1: Warn in group
    api.sendMessage({
      body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - ${supportGCLink}\nPlease join the support group for approval.`,
      attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
    }, groupID);

    // Step 2: Notify Owner
    try {
      const info = await api.getThreadInfo(groupID);
      const gcName = info.threadName || "Unknown Group";
      const memberCount = info.participantIDs?.length || "unknown";

      api.sendMessage(
        `⚠️ Bot added to unapproved group!\n\n👥 Group: ${gcName}\n🆔 Thread ID: ${groupID}\n👤 Members: ${memberCount}\n\n🚪 Leaving in 20 seconds...`,
        ownerID
      );
    } catch (e) {
      console.log("Owner DM failed:", e);
    }

    // Step 3: Leave after 20 sec
    setTimeout(async () => {
      try {
        await api.removeUserFromGroup(botID, groupID);
      } catch (error) {
        console.log("Leave error:", error);
      }
    }, 20000);
  }
};
