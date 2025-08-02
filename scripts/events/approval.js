const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const groupID = event.threadID;
  const botID = api.getCurrentUserID();
  const supportGC = "https://m.me/j/AbZd6HddcyXHEFki/";
  const masterUID = "100004252636599";

  let allowedGroups = [];
  try {
    allowedGroups = JSON.parse(fs.readFileSync('groups.json'));
  } catch (e) {
    console.log("❌ Error loading groups.json:", e);
  }

  // If group not approved
  if (!allowedGroups.includes(groupID)) {
    // Step 1: Warning Message
    api.sendMessage({
      body: `🚫 | You added the bot without permission!\n\n🌸 | Support GC - ${supportGC}\nPlease join the support group for approval.`,
      attachment: await getStreamFromURL("https://i.imgur.com/UQcCpOd.jpg")
    }, groupID);

    // Step 2: Wait and leave
    setTimeout(async () => {
      try {
        await api.sendMessage(
          `✅ | This group needs approval\n🆔: ${groupID}\n\n🍁 | Master Approve it if valid.`,
          masterUID
        );
        await api.removeUserFromGroup(botID, groupID);
      } catch (e) {
        console.log("❌ Leave error:", e);
      }
    }, 20000);
  }
};
