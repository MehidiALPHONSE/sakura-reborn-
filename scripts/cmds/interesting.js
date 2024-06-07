module.exports = {
    config: {
    name: "interesting",
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
    if (event.body && event.body.toLowerCase() === "interesting") {
    return message.reply({
    body: "Very interesting indeed🙂🍿",
    attachment: await global.utils.getStreamFromURL("https://i.imgur.com/0r2Sy7Q.png")
    });
    }
    }
   }