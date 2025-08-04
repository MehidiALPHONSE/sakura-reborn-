const fs = require('fs');
const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.5-fixed",
        author: "NTKhang & Modified by Arfan",
        category: "events"
    },

    langs: {
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "Hello {userNameTag}, welcome to {threadName}! Have a nice {session} 😊",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: `Thank you for adding me again\nHave a nice chat 😊`,
            approvalMessage: "Hi, I'm Sakura~. Thanks for adding me to the group\n\nBut you need approval to use the bot.\nPlease contact the admin\n\n💬 https://m.me/j/AbZd6HddcyXHEFki/\n\nI have to leave the chat now. Thank you!"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType !== "log:subscribe") return;

        const hours = getTime("HH");
        const { threadID } = event;
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
        const threadData = await threadsData.get(threadID);
        const allowedGroups = JSON.parse(fs.readFileSync('groups.json', 'utf-8'));

        // Bot added
        if (dataAddedParticipants.some(item => item.userFbId == botUserID)) {
            if (!allowedGroups.includes(threadID)) {
                api.sendMessage(getLang("approvalMessage"), threadID);
                return setTimeout(() => {
                    api.removeUserFromGroup(botUserID, threadID);
                }, 20 * 1000);
            } else {
                api.sendMessage(getLang("defaultWelcomeMessage"), threadID);
            }

            // Removed nickname change code here!

            return;
        }

        // New user(s) added to unapproved group
        if (!allowedGroups.includes(threadID)) {
            api.sendMessage(getLang("approvalMessage"), threadID);
            return setTimeout(() => {
                api.removeUserFromGroup(botUserID, threadID);
            }, 20 * 1000);
        }

        const newUsers = dataAddedParticipants.filter(u => u.userFbId !== botUserID);
        if (newUsers.length === 0) return;

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
                    if (user.userFbId == botUserID) continue;
                    if (dataBanned.some(item => item.id == user.userFbId)) continue;
                    userName.push(user.fullName);
                    mentions.push({ tag: user.fullName, id: user.userFbId });
                }

                if (userName.length === 0) return;

                let { welcomeMessage = getLang("welcomeMessage") } = threadData.data;

                const form = {
                    mentions: welcomeMessage.includes("{userNameTag}") ? mentions : [],
                    body: welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                        .replace(/\{session\}/g,
                            hours <= 10 ? getLang("session1") :
                            hours <= 12 ? getLang("session2") :
                            hours <= 18 ? getLang("session3") :
                            getLang("session4")
                        )
                };

                if (threadData.data.welcomeAttachment) {
                    const files = threadData.data.welcomeAttachment;
                    const attachments = files.map(file => drive.getFile(file, "stream"));
                    const results = await Promise.allSettled(attachments);
                    form.attachment = results
                        .filter(r => r.status === "fulfilled")
                        .map(r => r.value);
                }

                api.sendMessage(form, threadID);
                delete global.temp.welcomeEvent[threadID];
            }, 1500);
        }

        welcomeEvent.dataAddedParticipants.push(...newUsers);
        clearTimeout(welcomeEvent.joinTimeout);
    }
};
