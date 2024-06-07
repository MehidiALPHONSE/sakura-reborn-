module.exports = {
    config: {
        name: "👀",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: " 👀 Monkey-🙊🙈",
        longDescription: "No Prefix",
        category: "useless",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "👀") return message.reply("*poke those gae eyes*");
}
};