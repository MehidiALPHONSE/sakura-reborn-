async function onStart({ event, message, usersData, args, getLang }) {
    let avt;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    const uid3 = args[0] && /^\d+$/.test(args[0]) ? args[0] : null;

    if (event.type == "message_reply") {
        avt = await usersData.getAvatarUrl(event.messageReply.senderID);
    } else {
        if (!uid2) {
            if (uid3) {
                avt = await usersData.getAvatarUrl(uid3);
            } else {
                const regExCheckURL = /^(http|https):\/\/[^ "]+$/;
                const link = args[0];
                const uid4 = link ? await global.utils.findUid(link) : null;

                if (regExCheckURL.test(link) && uid4) {
                    avt = await usersData.getAvatarUrl(uid4);
                } else {
                    avt = await usersData.getAvatarUrl(uid1);
                }
            }
        } else {
            avt = await usersData.getAvatarUrl(uid2);
        }
    }

    message.reply({
        body: "",
        attachment: await global.utils.getStreamFromURL(avt)
    });
}

const config = {
    name: "pp",
    aliases: ["profile"],
    version: "1.1",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    shortDescription: "PROFILE image",
    longDescription: "PROFILE image",
    category: "image",
    guide: {
        en: "   {pn} @tag"
    }
};

const langs = {
    vi: {
        noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
        noTag: "You must tag the person you want to profile"
    }
};

module.exports = {
    config,
    langs,
    onStart
};
