const fs = require('fs');
const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

const allowedGroups = JSON.parse(fs.readFileSync('threads.json'));

module.exports = {
  config: {
    name: "welcome",
    version: "1.5",
    author: "NTKhang",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage: "Hello there! Welcome to the chat. Have a good convo here 😊",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage: "Thank you for adding me again\nHave a nice chat 😊",
      approvalMessage: "Hi, I'm Sakura~. Thanks for adding me to the group.\n\nBut you need approval to use the bot.\nPlease contact the admin 💬 m.me/j/AbZvu24dqVbfD5Rj/\n\nI have to leave the chat now. Thank you!"
    }
  },

  onStart: async ({ threadsData, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const hours = getTime("HH");
    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

    if (!global.temp.welcomeEvent[threadID]) {
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };
    }

    const welcomeEvent = global.temp.welcomeEvent[threadID];

    // Bot is not added itself
    if (!dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
      if (!welcomeEvent.botAdded) {
        welcomeEvent.botAdded = true;
        api.sendMessage(getLang("welcomeMessage", prefix), threadID);
      }
    } else {
      const botUserID = api.getCurrentUserID();
      const addedUserIDs = dataAddedParticipants.map(item => item.userFbId);

      if (nickNameBot) {
        api.changeNickname(nickNameBot, threadID, botUserID);
      }

      // If bot was added
      if (addedUserIDs.includes(botUserID)) {
        // Check if group is approved
        if (!allowedGroups.includes(threadID)) {
          api.sendMessage(getLang("approvalMessage"), threadID);
          setTimeout(() => {
            api.removeUserFromGroup(botUserID, threadID);
          }, 3000);
          return;
        } else {
          api.sendMessage(getLang("defaultWelcomeMessage", prefix), threadID);
        }
      } else {
        // Normal user join handling
        const threadData = await threadsData.get(threadID);
        const threadName = threadData.threadName;
        const { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
        const userName = dataAddedParticipants.map(user => user.fullName).join(", ");
        const session = hours <= 10 ? getLang("session1") :
                        hours <= 12 ? getLang("session2") :
                        hours <= 18 ? getLang("session3") : getLang("session4");

        const form = {
          body: welcomeMessage
            .replace(/\{userName\}/g, userName)
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(/\{session\}/g, session)
        };

        if (threadData.data.welcomeAttachment) {
          const files = threadData.data.welcomeAttachment;
          const attachments = files.map(file => drive.getFile(file, "stream"));
          const results = await Promise.allSettled(attachments);
          form.attachment = results
            .filter(res => res.status === "fulfilled")
            .map(res => res.value);
        }

        if (allowedGroups.includes(threadID)) {
          api.sendMessage(form, threadID);
        }
      }
    }

    // Handle multiple joins delayed message
    if (!welcomeEvent.joinTimeout) {
      welcomeEvent.joinTimeout = setTimeout(async () => {
        const dataAddedParticipants = welcomeEvent.dataAddedParticipants;
        const threadData = await threadsData.get(threadID);
        const threadName = threadData.threadName;
        const dataBanned = threadData.data.banned_ban || [];

        if (threadData.settings.sendWelcomeMessage === false) return;

        const userName = [];
        const mentions = [];
        let multiple = dataAddedParticipants.length > 1;

        for (const user of dataAddedParticipants) {
          if (dataBanned.some(item => item.id == user.userFbId)) continue;
          userName.push(user.fullName);
          mentions.push({ tag: user.fullName, id: user.userFbId });
        }

        if (userName.length === 0) return;

        let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
        const session = hours <= 10 ? getLang("session1") :
                        hours <= 12 ? getLang("session2") :
                        hours <= 18 ? getLang("session3") : getLang("session4");

        const form = {
          mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null,
          body: welcomeMessage
            .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
            .replace(/\{session\}/g, session)
        };

        if (threadData.data.welcomeAttachment) {
          const files = threadData.data.welcomeAttachment;
          const attachments = files.map(file => drive.getFile(file, "stream"));
          const results = await Promise.allSettled(attachments);
          form.attachment = results
            .filter(res => res.status === "fulfilled")
            .map(res => res.value);
        }

        if (allowedGroups.includes(threadID)) {
          api.sendMessage(form, threadID);
        }

        delete global.temp.welcomeEvent[threadID];
      }, 1500);
    }

    welcomeEvent.dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(welcomeEvent.joinTimeout);
  }
};
