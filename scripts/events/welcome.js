const fs = require('fs');
const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

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
            defaultWelcomeMessage: `Thank you for adding me again\nhave a nice chat 😊`,
            approvalMessage: "Hi, I'm Sakura~. Thanks for adding me to the group\n\nBut you need approval to use the bot.\nPlease contact the admin \n\n💬 https://m.me/j/AbZd6HddcyXHEFki/\n\nI have to leave the chat now. Thank you!"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType !== "log:subscribe") return;

        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;
        const botUserID = api.getCurrentUserID();

        if (!global.temp.welcomeEvent[threadID]) {
            global.temp.welcomeEvent[threadID] = {
                joinTimeout: null,
                dataAddedParticipants: [],
                botAdded: false
            };
        }

        const welcomeEvent = global.temp.welcomeEvent[threadID];

        // ✅ Bot added to group
        if (dataAddedParticipants.some(item => item.userFbId == botUserID)) {
            const allowedGroups = JSON.parse(fs.readFileSync('groups.json', 'utf-8'));

            if (!allowedGroups.includes(threadID)) {
                api.sendMessage(getLang("approvalMessage"), threadID);
                setTimeout(() => api.removeUserFromGroup(botUserID, threadID), 20000);
            } else {
                api.sendMessage(getLang("defaultWelcomeMessage"), threadID); // thank you msg
            }

            return;
        }

        // ✅ Bot not added but other people added
        const addedUserIDs = dataAddedParticipants.map(item => item.userFbId);
        if (nickNameBot) {
            api.changeNickname(nickNameBot, threadID, botUserID);
        }

        const threadData = await threadsData.get(threadID);
        const allowedGroups = JSON.parse(fs.readFileSync('groups.json', 'utf-8'));
        if (!allowedGroups.includes(threadID)) {
            api.sendMessage(getLang("approvalMessage"), threadID);
            setTimeout(() => api.removeUserFromGroup(botUserID, threadID), 20000);
            return;
        }

        // 👤 Save new user data
        if (!welcomeEvent.joinTimeout) {
            welcomeEvent.joinTimeout = setTimeout(async () => {
                const dataAddedParticipants = welcomeEvent.dataAddedParticipants;
                const dataBanned = threadData.data.banned_ban || [];

                if (threadData.settings.sendWelcomeMessage === false) return;

                const threadName = threadData.threadName;
                const userName = [];
                const mentions = [];
                const multiple = dataAddedParticipants.length > 1;

                for (const user of dataAddedParticipants) {
                    if (dataBanned.some(item => item.id == user.userFbId)) continue;
                    userName.push(user.fullName);
                    mentions.push({
                        tag: user.fullName,
                        id: user.userFbId
                    });
                }

                if (userName.length === 0) return;

                let { welcomeMessage = getLang("welcomeMessage") } = threadData.data;

                const form = {
                    mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                };

                welcomeMessage = welcomeMessage
                    .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadName)
                    .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                    .replace(/\{session\}/g,
                        hours <= 10 ? getLang("session1") :
                            hours <= 12 ? getLang("session2") :
                                hours <= 18 ? getLang("session3") :
                                    getLang("session4")
                    );

                form.body = welcomeMessage;

                if (threadData.data.welcomeAttachment) {
                    const files = threadData.data.welcomeAttachment;
                    const attachments = files.reduce((acc, file) => {
                        acc.push(drive.getFile(file, "stream"));
                        return acc;
                    }, []);
                    form.attachment = (
                        await Promise.allSettled(attachments)
                    )
                        .filter(({ status }) => status == "fulfilled")
                        .map(({ value }) => value);
                }

                api.sendMessage(form, threadID);
                delete global.temp.welcomeEvent[threadID];
            }, 1500);
        }

        welcomeEvent.dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(welcomeEvent.joinTimeout);
    }
};
