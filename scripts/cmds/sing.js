const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    version: "1.0",
    author: "Arfan",
    role: 0,
    category: "music",
    shortDescription: {
      en: "Play music from YouTube by song name."
    },
    longDescription: {
      en: "Searches YouTube and plays audio under 25MB without any external API."
    },
  },

  onStart: async function ({ api, event, message, args }) {
    try {
      const song = args.join(" ");
      if (!song) return message.reply("❌ Please provide a song name.");

      const searchingMessage = await message.reply(`🔍 Searching for "${song}"...`);
      const searchResults = await yts(song);

      if (!searchResults.videos.length)
        return message.reply("❌ No results found for that song.");

      const video = searchResults.videos[0];
      const fileName = `music_${event.senderID}.mp3`;
      const tmpDir = path.join(__dirname, "tmp");

      await fs.ensureDir(tmpDir);
      const filePath = path.join(tmpDir, fileName);

      const stream = ytdl(video.url, { filter: "audioonly" });
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", async () => {
        const stats = fs.statSync(filePath);
        if (stats.size > 26214400) { // 25MB limit
          fs.unlinkSync(filePath);
          return message.reply("❌ The audio file is too large to send (over 25MB).");
        }
        await api.unsendMessage(searchingMessage.messageID);
        await message.reply({
          body: `🎵 Title: ${video.title}\n⏳ Duration: ${video.timestamp}\n📺 Channel: ${video.author.name}`,
          attachment: fs.createReadStream(filePath),
        }, () => fs.unlinkSync(filePath));
      });

      stream.on("error", (err) => {
        console.error("[ytdl error]", err);
        message.reply("❌ Error occurred while downloading the audio.");
      });
    } catch (err) {
      console.error("[sing command error]", err);
      message.reply("❌ Something went wrong while processing your request.");
    }
  },
};
