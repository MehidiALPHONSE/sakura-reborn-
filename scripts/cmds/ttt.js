module.exports = { config: { name: "ttt", aliases: ["tictactoe"], version: "1.2", author: "Arfan", role: 0, shortDescription: { en: "Tic Tac Toe with friends" }, longDescription: { en: "Play Tic Tac Toe by mentioning a friend. Reply with 1-9 to play." }, category: "game", guide: "Use: ttt @friend\nReply with number (1-9) to make your move.\nUse: ttt close — to end the game." },

onStart: async function ({ event, message, api, usersData, args }) { const mention = Object.keys(event.mentions);

if (!global.game) global.game = {};
const game = global.game[event.threadID];

if (args[0] === "close") {
  if (!game?.on) {
    return message.reply("❌ No game is currently running in this thread.");
  }

  if (event.senderID === game.player1.id || event.senderID === game.player2.id) {
    const quitter = event.senderID === game.player1.id ? game.player1 : game.player2;
    const winner = event.senderID === game.player1.id ? game.player2 : game.player1;
    message.reply({
      body: `🏳️ ${quitter.name} quit.\n🏆 Winner: ${winner.name}`,
      mentions: [
        { tag: game.player1.name, id: game.player1.id },
        { tag: game.player2.name, id: game.player2.id }
      ]
    });
    game.on = false;
  } else {
    message.reply("You are not part of the current game.");
  }
  return;
}

if (game?.on) {
  return message.reply("❌ A game is already running in this thread. Type `ttt close` to end it before starting a new one.");
}

if (mention.length === 0) {
  return message.reply("⚠️ Mention someone to start a game!");
}

const player1 = {
  id: event.senderID,
  name: await usersData.getName(event.senderID),
  mark: "❌"
};

const player2 = {
  id: mention[0],
  name: await usersData.getName(mention[0]),
  mark: "⭕"
};

const board = Array(9).fill("⬜");

const displayBoard = () =>
  `${board[0]} | ${board[1]} | ${board[2]}\n` +
  `${board[3]} | ${board[4]} | ${board[5]}\n` +
  `${board[6]} | ${board[7]} | ${board[8]}`;

const intro =
  `🎮 Tic Tac Toe 🎮\n\n` +
  `${player1.name} (❌) vs ${player2.name} (⭕)\n\n` +
  displayBoard() + `\n\n` +
  `Reply with a number (1-9) to place your mark:\n` +
  `1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣`;

message.reply(intro, (err, info) => {
  global.game[event.threadID] = {
    on: true,
    board,
    turn: player1,
    player1,
    player2,
    moveCount: 0,
    messageID: info.messageID
  };
});

},

onChat: async function ({ event, message }) { const game = global.game?.[event.threadID]; if (!game?.on) return;

if (event.type === "message_reply" && event.messageReply.messageID === game.messageID) {
  const input = event.body.trim();
  const move = parseInt(input);

  if (isNaN(move) || move < 1 || move > 9)
    return message.reply("❗ Invalid input. Reply with number 1-9.");

  if (event.senderID !== game.turn.id)
    return message.reply("⏳ It's not your turn.");

  const index = move - 1;
  if (game.board[index] !== "⬜")
    return message.reply("❌ That cell is already taken!");

  game.board[index] = game.turn.mark;
  game.moveCount++;

  const displayBoard = () =>
    `${game.board[0]} | ${game.board[1]} | ${game.board[2]}\n` +
    `${game.board[3]} | ${game.board[4]} | ${game.board[5]}\n` +
    `${game.board[6]} | ${game.board[7]} | ${game.board[8]}`;

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const won = winPatterns.some(p =>
    p.every(i => game.board[i] === game.turn.mark)
  );

  if (won) {
    game.on = false;
    return message.reply(displayBoard() + `\n\n🎉 ${game.turn.name} wins! 🏆`);
  }

  if (game.moveCount === 9) {
    game.on = false;
    return message.reply(displayBoard() + `\n\n🤝 It's a draw!`);
  }

  game.turn = game.turn.id === game.player1.id ? game.player2 : game.player1;

  message.reply(
    displayBoard() +
    `\n\nNow it's ${game.turn.name}'s (${game.turn.mark}) turn.\nReply with a number (1-9):`
  );
}

} };

