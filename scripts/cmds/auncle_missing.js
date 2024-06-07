module.exports = {
    config: {
        name: "auncle",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: "",
        longDescription: "No Prefix",
        category: "useless",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "auncle") return message.reply("Your auncle is here with apples🙄");
}
};