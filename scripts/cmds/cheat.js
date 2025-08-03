module.exports = {
  config: {
    name: "cheat",
    version: "1.0",
    author: "SiAM",
    role: 2,
    category: "Admin",
    guide: {
      en: "{pn} money 'amount' [ uid | mention]\n{pn} money-r 'amount' [ uid | mention]\n\n{pn} exp 'amount' [ uid | mention]\n{pn} exp-r 'amount' [ uid | mention]"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {

    const permission = ["100072406326922","","100038029237574"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("❌ | You aren't allowed to use this command!!", event.threadID, event.messageID);
    const hack = args[0];
    const amount = parseInt(args[1]);
    const User = event.mentions && Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : args[2];

    if (!hack || !amount || isNaN(amount)) {
      message.reply("Invalid usage. Please provide a valid hack and amount.");
      return;
		}

    if (!User || isNaN(User)) {
      message.reply("Invalid user specified. Please provide a valid UID or mention a user.");
      return;
    }

    const findname = await api.getUserInfo(User);
    const name = findname[User].name;

    const userData = await usersData.get(User);
    if (!userData) {
      message.reply("User data not found.");
      return;
    }

    let newMoney = userData.money;
    let newExp = userData.exp;

    if (hack === "money") {
      newMoney += amount;
      message.reply(`✅ | Updated money: ${amount}$ for user ${name}`);
    } else if (hack === "money-r") {
      newMoney -= amount;
      message.reply(`✅ | Removed money ${amount}$ for user ${name}`);
    } else if (hack === "exp") {
      newExp += amount;
      message.reply(`✅ | Updated exp ${amount} for user ${name}`);
    } else if (hack === "exp-r") {
      newExp -= amount;
      message.reply(`✅ | Removed exp ${amount} for user ${name}`);
    } else {
      message.reply("Invalid input ❌");
      return;
    }

    try {
      await usersData.set(User, {
        money: newMoney,
        exp: newExp,
        data: userData.data
      });
    } catch (error) {
      message.reply("error❌");
      console.error(error);
    }
  }
};