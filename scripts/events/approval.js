// scripts/events/approvalLeave.js

const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = async function ({ api, event }) {
  try {
    console.log("🟢 approvalLeave.js event triggered");
    
    // Only run on member added
    if (event.logMessageType !== "log:subscribe") return;

    const threadsFile = 'threads.json';
    const supportGCLink = "https://m.me/j/AbZd6HddcyXHEFki/";
    const botID = api.getCurrentUserID();
    const groupID = event.threadID;

    // ✅ Load approved thread IDs
    let approvedThreads = [];
    try {
      if (fs.existsSync(threadsFile)) {
        approvedThreads = JSON.parse(fs.readFileSync(threadsFile, "utf8"));
      }
    } catch (err) {
      console.log("❌ threads.json read error:", err);
    }

    // ✅ If not approved, warn and leave
    if (!approvedThreads.includes(groupID)) {
      console.log(`🚫 Not approved group: ${groupID}`);

      await api.sendMessage({
        body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - ${supportGCLink}\nPlease join the support group for approval.`,
        attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
      }, groupID);

      // Wait 20s then leave
      setTimeout(async () => {
        try {
          await api.removeUserFromGroup(botID, groupID);
          console.log("✅ Bot left group:", groupID);
        } catch (leaveError) {
          console.log("❌ Leave error:", leaveError);
        }
      }, 20000);
    } else {
      console.log("✅ Approved group, no action needed.");
    }

  } catch (error) {
    console.log("❌ approvalLeave.js error:", error);
  }
};
