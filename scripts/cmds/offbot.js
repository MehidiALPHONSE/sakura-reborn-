module.exports = {
  config: {
    name: "offbot",
    aliases: ["silence"],
    version: "1.0",
    author: "Samir",
    countDown: 45,
    role: 2,
    shortDescription: "Turn off bot",
    longDescription: "Turn off bot",
    category: "owner",
    guide: "{p}{n}"
  },
  onStart: async function ({event, api}) {
    api.sendMessage("╔════ஜ۩۞۩ஜ═══╗\n\n📴Successfully Silenced All Bot Systems ✅\n\n╚════ஜ۩۞۩ஜ═══╝",event.threadID, () =>process.exit(0))}
};