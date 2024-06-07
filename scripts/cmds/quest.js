module.exports = {
    config: {
      name: "quest", 
      version: "1.0",
      author: "LiANE",
      countDown: 5,
      role: 0,
      shortDescription: {
        vi: "Làm việc để kiếm tiền",
        en: "Quest to earn money"
      },
      longDescription: {
        vi: "Thực hiện công việc và nhận tiền thưởng.",
        en: "Quest to earn money"
      },
      category: "💰 economy", 
      guide: {
        en: "   {pn} hunt: balance reward: ?\n"
          + "   {pn} : balance reward: ?\n"
          + "   {pn} explore: balance reward: ?",
        en: "   {pn} hunt: balance reward: ?\n"
          + "   {pn} adventure: balance reward: ?\n"
          + "   {pn} explore: balance reward: ?"
      }
    },
  
    onStart: async function ({ args, message, event, usersData }) {
      const command = args[0];
  
      if (command === "hunt") {
  
        const result = Math.random() > 0.5;
        const reward = result ? 1000 : -500; // Adjust the reward
        if (result) {
          return message.reply(`You successfully completed the Hunt Quest and earned ${reward} $. Congratulations!🎉🎉`);
        } else {
          return message.reply(`The Hunt Quest didn't go as planned. You lost ${Math.abs(reward)} $. Better luck next time.`);
        }
    //   } else if (command === "guessinggame") {
    //     // Guessing Game: Make it a fun game
    //     const guess = Math.floor(Math.random() * 10); // Random number to guess
    //     const userGuess = parseInt(args[1]);
  
    //     if (!isNaN(userGuess) && userGuess === guess) {
    //       const reward = 200; // Reward amount
    //       return message.reply(`Congratulations! You won the guessing game and earned ${reward} $.`);
    //     } else {
    //       return message.reply("Try guessing a number between 0 and 9.");
    //     }
      } else if (command === "explore") {
        // Luck Test: Make it a luck-based task
        const lucky = Math.random() > 0.5;
        const reward = lucky ? 1000 : -500; // Reward amount
        if (lucky) {
          return message.reply("Luck was on your side! You passed found some treasures and earned 1000 $.");
        } else {
          return message.reply("Unfortunately, luck wasn't on your side this time. You lost 500 $.");
        }
      } else if (command === "show") {
        // Provide a list of available work commands
        return message.reply(`Available work commands:\n\n`
          + `1. hunt: Random challenge, balance reward: Varies\n`
          + `2. guessinggame: Guessing game, balance reward: 200$\n`
          + `3. explore: Luck-based game, balance reward: Varies`);
      } else {
        return message.reply(`Invalid work command. Use "show" to see available commands.`);
      }
    }
  };
  