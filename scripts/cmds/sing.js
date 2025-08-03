const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const path = require("path");

module.exports = {
  config: {
    name: "play",
    version: "1.1",
    author: "Arfan",
    countDown: 5,
    role: 0,
    category: "music",
    shortDescription: {
      en: "Play a song from YouTube"
    },
    longDescription: {
      en: "Searches YouTube and plays audio under 25MB"
    },
    guide: {
      en: "{pn} song name"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");
    if (!query) return message.reply("❌ | Please provide a song name.\nExample: play tum hi ho");

    const tmpPath = path.join(__dirname, "tmp");
    await fs.ensureDir(tmpPath);
    const filePath = path.join(tmpPath, `${event.senderID}_play.mp3`);

    try {
      const wait = await message.reply("🔍 Searching...");

      const search = await yts(query);
      if (!search.videos.length) return message.reply("❌ | No results found.");

      const video = search.videos[0];
      const stream = ytdl(video.url, { filter: "audioonly" });

      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", async () => {
        const size = fs.statSync(filePath).size;
        if (size > 26214400) {
          fs.unlinkSync(filePath);
          return message.reply("❌ | File too large to send (over 25MB).");
        }

        await api.unsendMessage(wait.messageID);
        await message.reply({
          body: `🎧 Title: ${video.title}\n🕒 Duration: ${video.timestamp}\n📺 Channel: ${video.author.name}`,
          attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));
      });

      stream.on("error", err => {
        console.error("[ytdl error]", err);
        message.reply("❌ | Error while downloading the audio.");
      });

    } catch (e) {
      console.error("[play.js error]", e);
      message.reply("❌ | Something went wrong.");
    }
  }
};
