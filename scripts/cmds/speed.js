module.exports = {
  config: {
    name: "ping",
    version: "1.0",
    author: "MILAN",
    countDown: 10,
    role: 2,
    shortDescription: "Test network speed",
    longDescription: "",
    category: "system",
    guide: {
      en: "{pn}",
    }
  },

  onStart: async function ({ message, args, event, api }) {
	try {
		const fast = require("fast-speedtest-api");
		const speedTest = new fast({
			token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
			verbose: false,
			timeout: 10000,
			https: true,
			urlCount: 5,
			bufferSize: 8,
			unit: fast.UNITS.Mbps
		});
		const resault = await speedTest.getSpeed();
		return api.sendMessage(
			"Result" + 
			"\- Speed: " + resault + " Mbps",
			event.threadID, event.messageID
		);
	}
	catch {
		return api.sendMessage("Can't speedtest right now, try again later!", event.threadID, event.messageID);
	}
}
};