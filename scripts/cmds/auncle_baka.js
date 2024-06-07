module.exports = {
    config: {
        name: "baka",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: " 🙄Baka ",
        longDescription: "No Prefix",
        category: "useless",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "baka") return message.reply("(\/)\ •_•)\/ >🧠\ You Seem To Need This More Then Anything,DUMB ASS!");
}
};