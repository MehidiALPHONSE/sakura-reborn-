const fs = require('fs');

module.exports = {
  config: {
    name: "approve",
    version: "2.0",
    role: "2",
    author: "Loufi | Arfan",
    cooldown: "5",
    shortDescription: {
      en: "Approve or disapprove a group",
    },
    longDescription: {
      en: "Add or remove a group ID from groups.json to control bot access",
    },
    category: "Developer",
    guide: {
      en: "{pn} add/remove [group ID]",
    }
  },

  onStart: async function ({ api, event, threadsData, message, args }) {
    const groupsFile = 'groups.json';

    if (args.length < 2) {
      return message.reply("❗ Usage: approve add/remove [groupID]");
    }

    const action = args[0].toLowerCase();
    const groupId = args[1];
    let name = "";

    try {
      const threadData = await threadsData.get(groupId);
      name = threadData?.threadName || "Unknown Group";
    } catch (err) {
      name = "Unknown Group";
    }

    let groups = [];
    try {
      if (fs.existsSync(groupsFile)) {
        groups = JSON.parse(fs.readFileSync(groupsFile, 'utf8'));
      }
    } catch (err) {
      console.error("❌ Failed to read groups.json:", err);
    }

    if (action === "add") {
      if (!groups.includes(groupId)) {
        groups.push(groupId);
        fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));
        return message.reply(`✅ Approved!\n📌 Group: ${name}\n🆔 TID: ${groupId}`);
      } else {
        return message.reply(`ℹ️ Group already approved!\n📌 Group: ${name}\n🆔 TID: ${groupId}`);
      }
    }

    if (action === "remove") {
      if (groups.includes(groupId)) {
        groups = groups.filter(id => id !== groupId);
        fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));
        return message.reply(`❌ Disapproved!\n📌 Group: ${name}\n🆔 TID: ${groupId}`);
      } else {
        return message.reply(`ℹ️ This group is not approved yet.\n🆔 TID: ${groupId}`);
      }
    }

    return message.reply("❗ Invalid action. Use: add/remove");
  }
};
