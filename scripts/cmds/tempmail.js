const axios = require('axios');
module.exports = {
 config: {
    name: "tempmail",
    version: "1.1",
    role: 2,
    countdown: 5,
    author: "Rehat86 | samirAPIs",
    longDescription: "Create temporary email and check inbox messages",
    category: "owner",
 },

 onStart: async ({ api, event, args }) => {
    try {
      if (!args[0]) {
        return api.sendMessage("❌ Please specify 'inbox' or 'create' as the first argument.", event.threadID);
      }

      const command = args[0].toLowerCase();

      if (command === 'inbox') {
        const emailAddress = args[1];
        if (!emailAddress) {
          return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
        }

        // Updated URL for 'inbox' command
        const inboxResponse = await axios.get(`https://api-samir.onrender.com/tempmail/inbox/${emailAddress}`);
        const messages = inboxResponse.data;

        if (!messages || messages.length === 0) {
          return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID, event.messageID);
        }

        let messageText = '📬 Inbox Messages: 📬\n\n';
        for (const message of messages) {
          messageText += `📧 Sender: ${message.from}\n`;
          messageText += `📑 Subject: ${message.subject || 'Empty'}\n`;
          messageText += `📩 Message: ${message.body}\n`;
        }

        api.sendMessage(messageText, event.threadID);
      } else if (command === 'create') {
        // Updated URL for 'create' command
        const tempMailResponse = await axios.get("https://api-samir.onrender.com/tempmail/get");
        const tempMailData = tempMailResponse.data;

        if (!tempMailData.email) {
          return api.sendMessage("Failed to generate temporary email.", event.threadID, event.messageID);
        }

        api.sendMessage(`📩 Here's your generated temporary email: ${tempMailData.email}`, event.threadID);
      } else {
        return api.sendMessage("Please specify 'inbox' or 'create'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
 }
};
