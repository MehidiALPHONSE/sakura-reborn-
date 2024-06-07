module.exports = {
 config: {
 name: "batman",
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
 if (event.body && event.body.toLowerCase() === "batman") {
 return message.reply({
 body: "Don't call me I'm out saving Gotham(reading novels)😎",
 attachment: await global.utils.getStreamFromURL("https://i.ibb.co/BnyDsBY/430075076.jpg")
 });
 }
 }
}