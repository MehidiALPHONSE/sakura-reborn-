module.exports = {
    config: {
    name: "lol2",
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
    if (event.body && event.body.toLowerCase() === "lul") {
    return message.reply({
    body: "⬆⬆⬆⬆⬆ Haha look I found a gay😀",
    attachment: await global.utils.getStreamFromURL("https://i.imgur.com/e6Rtr8z.png")
    });
    }
    }
   }