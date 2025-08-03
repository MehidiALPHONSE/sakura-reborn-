const axios = require("axios");

module.exports = {
  config: {
    name: "liner",
    version: "1.0",
    author: "Arfan",
    countDown: 3,
    role: 0,
    shortDescription: "Chat with AI using Shuddho API",
    longDescription: "Send prompt to Shuddho AI and get response",
    category: "ai",
    guide: "{pn} [your message] or reply to a message"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = event.type === "message_reply"
      ? event.messageReply.body
      : args.join(" ");

    if (!prompt) {
      return api.sendMessage("❌ Please provide a prompt or reply to a message.", event.threadID, event.messageID);
    }

    try {
      // Prothome temporary message pathano
      const thinkingMsg = await api.sendMessage("Liner Thinking...⏳", event.threadID);

      const res = await axios.get(`https://ts-ai-api-shuddho.onrender.com/api/liner`, {
        params: { prompt }
      });

      const reply = res.data?.answer;

      if (!reply || typeof reply !== "string") {
        // Temporary message delete koro
        await api.unsendMessage(thinkingMsg.messageID);
        return api.sendMessage("⚠ AI returned no message.", event.threadID, event.messageID);
      }

      // Temporary message delete kore AI reply pathao
      await api.unsendMessage(thinkingMsg.messageID);
      return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);

    } catch (error) {
      console.error("AI API error:", error.message);
      return api.sendMessage("❌ Error fetching AI response.", event.threadID, event.messageID);
    }
  }
};
