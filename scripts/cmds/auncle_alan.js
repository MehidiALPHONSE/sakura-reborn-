module.exports = {
    config: {
        name: "alan",
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
    if (event.body && event.body.toLowerCase() == "alan") return message.reply("Alan is the biggest gae to ever exist🤢🤮");
}
};