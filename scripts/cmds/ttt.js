const { getPrefix } = global.utils;

module.exports = { config: { name: "ttt", version: "1.0", author: "arfan", countDown: 5, role: 0, shortDescription: { en: "play tictactoe" }, longDescription: { en: "play tictactoe with friend" }, category: "game", guide: { en: "Use {pn} to play tictactoe with another member." } },

onStart: async function ({ api, event, args, message }) { if (!global.fff) global.fff = [];

const xEmoji = "❌";
const oEmoji = "⭕";
const emptyEmoji = "➖";

function renderBoard(board) {
  let display = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      display += board[i][j] + " ";
    }
    display += "\n";
  }
  return display;
}

function createBoard() {
  return [
    [emptyEmoji, emptyEmoji, emptyEmoji],
    [emptyEmoji, emptyEmoji, emptyEmoji],
    [emptyEmoji, emptyEmoji, emptyEmoji]
  ];
}

function checkWin(board, player) {
  // Rows and columns
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
  }
  // Diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;

  return false;
}

function isFull(board) {
  return board.every(row => row.every(cell => cell !== emptyEmoji));
}

if (!args[0] || Object.keys(event.mentions).length === 0) {
  return message.reply("Mention someone to play with!");
}

const opponentID = Object.keys(event.mentions)[0];
if (opponentID === event.senderID) {
  return message.reply("You can't play with yourself!");
}

if (global.game && global.game[event.threadID]) {
  return message.reply("A game is already in progress in this thread.");
}

const board = createBoard();
const game = {
  board,
  playerX: event.senderID,
  playerO: opponentID,
  turn: "X"
};

const boardMessage = await message.reply(
  `🎮 Tic Tac Toe 🎮\n\n${event.senderID} (❌) vs ${opponentID} (⭕)\n\n${renderBoard(board)}\n❌ = ${event.senderID}\n⭕ = ${opponentID}\n\nReply with row,col to make a move (e.g., 1,2)`
);

game.messageID = boardMessage.messageID;
global.game = global.game || {};
global.game[event.threadID] = game;

},

onChat: async function ({ api, event, message }) { const game = global.game && global.game[event.threadID]; if (!game || event.messageID === game.messageID) return;

const move = event.body.split(",").map(num => parseInt(num.trim()) - 1);
if (move.length !== 2 || move.some(n => n < 0 || n > 2)) return;

const [row, col] = move;
const currentPlayer = game.turn === "X" ? game.playerX : game.playerO;
if (event.senderID !== currentPlayer) return;

if (game.board[row][col] !== "➖") {
  return message.reply("That spot is already taken!");
}

game.board[row][col] = game.turn === "X" ? "❌" : "⭕";

if (checkWin(game.board, game.board[row][col])) {
  message.reply(`🎉 Player ${event.senderID} wins! 🎉\n\n${renderBoard(game.board)}`);
  delete global.game[event.threadID];
  return;
}

if (isFull(game.board)) {
  message.reply(`It's a draw! 🤝\n\n${renderBoard(game.board)}`);
  delete global.game[event.threadID];
  return;
}

game.turn = game.turn === "X" ? "O" : "X";
const nextPlayer = game.turn === "X" ? game.playerX : game.playerO;

message.reply(
  `🕹️ It's ${nextPlayer}'s turn (${game.turn === "X" ? "❌" : "⭕"})\n\n${renderBoard(game.board)}\nReply with row,col to move.`
);

} };

