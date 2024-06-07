module.exports = {
    config: {
    name: "shino",
    version: "1.0",
    author: "leeza", // xue editz
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "useless",
    }, 
    onStart: async function(){}, 
    onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "shino") {
    return message.reply({
    body: "I am a simplien gaelord named Pablo who simps for girls😿",
    attachment: await global.utils.getStreamFromURL("https://i.imgur.com/5eLLlKi.png")
    });
    }
    }
   }