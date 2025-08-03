const axios = require("axios");

module.exports = {
  config: {
    name: "computerchat",
    version: "1.1",
    author: "Arfan",
    countDown: 3,
    role: 0,
    shortDescription: "Computer AI Chat using Shuddho API",
    longDescription: "Send prompt to ComputerChat AI and get response",
    category: "ai",
    guide: "{pn} [your message] or reply to a message"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = event.type === "message_reply"
      ? event.messageReply.body
      : args.join(" ").toLowerCase();

    if (!prompt) {
      return api.sendMessage("❌ Please provide a prompt or reply to a message.", event.threadID, event.messageID);
    }

    // Handle identity-related questions manually
    const identityQuestions = [
      "who are you", "what's your name", " who is your owner", "who is ur owner", "what is your name", "tell me about yourself",
      "who made you", "who created you", "are you a bot", "developer?"
    ];

    if (identityQuestions.some(q => prompt.includes(q))) {
      const identityMsg =
        "🧠 I am Sakura AI — a smart chatbot developed by Arfan.\n" +
        "🤖 I'm built with AI technology to assist users like you with answers, conversations, and helpful tasks.\n" +
        "🛠️ My purpose is to respond to your queries using intelligent API responses.";
      return api.sendMessage(identityMsg, event.threadID, event.messageID);
    }

    try {
      const thinkingMsg = await api.sendMessage("Computer Thinking...⏳", event.threadID);

      const res = await axios.get("https://ts-ai-api-shuddho.onrender.com/api/computerchat", {
        params: { prompt }
      });

      const reply = res.data?.response;

      await api.unsendMessage(thinkingMsg.messageID);

      if (!reply || typeof reply !== "string") {
        return api.sendMessage("⚠ AI returned no message.", event.threadID, event.messageID);
      }

      return api.sendMessage(`🧠 ${reply}`, event.threadID, event.messageID);

    } catch (error) {
      console.error("ComputerChat API error:", error.message);
      return api.sendMessage("❌ Error fetching AI response.", event.threadID, event.messageID);
    }
  }
};
