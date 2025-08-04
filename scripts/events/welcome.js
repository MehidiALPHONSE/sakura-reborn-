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
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!",
            approvalMessage: "Hi, I'm Nezuko bot. Thanks for adding me to the group\n\nBut you need approval to use the bot.\nPlease contact the admin \n\n💬 m.me/JISHAN76\n\n I have to leave the chat now. Thank you!"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "Hello there! Welcome to the chat. Have a good convo here😊",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: `thank you for adding me again\nhave a nice chat 😊`,
            approvalMessage: "Hi, I'm Sakura~. Thanks for adding me to the group\n\nBut you need approval to use the bot.\nPlease contact the admin \n\n💬 https://m.me/j/AbZd6HddcyXHEFki//\n\n I have to leave the chat now. Thank you!"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe") {
            return async function () {
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

                const botUserID = api.getCurrentUserID();

                if (!dataAddedParticipants.some((item) => item.userFbId == botUserID)) {
                    if (!welcomeEvent.botAdded) {
                        welcomeEvent.botAdded = true;
                        api.sendMessage(getLang("welcomeMessage", prefix), threadID);
                    }
                } else {
                    if (nickNameBot) {
                        api.changeNickname(nickNameBot, threadID, botUserID);
                    }

                    const allowedGroups = JSON.parse(fs.readFileSync('groups.json'));

                    if (!allowedGroups.includes(threadID)) {
                        api.sendMessage({
                            body: getLang("approvalMessage"),
                            mentions: [
                                {
                                    tag: "Admin",
                                    id: botUserID
                                }
                            ]
                        }, threadID);

                        setTimeout(() => {
                            api.removeUserFromGroup(botUserID, threadID);
                        }, 20000); // 20 seconds wait before leaving the group
                        return;
                    }

                    api.sendMessage(getLang("defaultWelcomeMessage", prefix), threadID);
                }

                const threadData = await threadsData.get(threadID);
                const threadName = threadData.threadName;
                const { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
                const userName = dataAddedParticipants.map((user) => user.fullName).join(", ");
                const session = hours <= 10 ? getLang("session1")
                    : hours <= 12 ? getLang("session2")
                        : hours <= 18 ? getLang("session3")
                            : getLang("session4");
                const boxName = threadName;
                const welcomeMessageText = welcomeMessage
                    .replace(/\{userName\}/g, userName)
                    .replace(/\{boxName\}|\{threadName\}/g, boxName)
                    .replace(/\{session\}/g, session);
                const form = { body: welcomeMessageText };

                if (threadData.data.welcomeAttachment) {
                    const files = threadData.data.welcomeAttachment;
                    const attachments = files.reduce((acc, file) => {
                        acc.push(drive.getFile(file, "stream"));
                        return acc;
                    }, []);
                    form.attachment = (
                        await Promise.allSettled(attachments)
                    ).filter(({ status }) => status == "fulfilled")
                        .map(({ value }) => value);
                }

                api.sendMessage(form, threadID);
                delete global.temp.welcomeEvent[threadID];
            };
        }
    }
};
