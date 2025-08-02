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

onChat: async function ({ event, message }) {
  if (event.messageReply && global.game?.[event.threadID]?.on) {
    const game = global.game[event.threadID];

    if (event.messageReply.messageID === game.bid) {
      if (game.turn === event.senderID) {
        const input = event.body;
        if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(input)) {
          if (!game.avcell.includes(input)) return message.reply("this one is already blocked");

          game.avcell = game.avcell.filter(x => x !== input);
          let index = parseInt(input) - 1;
          game.board2 = game.board2.substr(0, index) + game.bidd + game.board2.substr(index + 1);

          let boardArray = game.board.replace(/\n/g, '').split('');
          boardArray[index] = game.bidd;
          game.board = `${boardArray.slice(0, 3).join('')}\n${boardArray.slice(3, 6).join('')}\n${boardArray.slice(6).join('')}`;

          message.send(game.board, (err, info) => {
            game.bid = info.messageID;
            global.fff.push(info.messageID);
          });

          const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
          ];

          const won = wins.find(w => w.every(i => game.board2[i] === game.bidd));

          if (won) {
            for (let i of won) boardArray[i] = '✅';
            game.board = `${boardArray.slice(0, 3).join('')}\n${boardArray.slice(3, 6).join('')}\n${boardArray.slice(6).join('')}`;
            message.send(game.board);

            const winner = game.turn === game.player1.id ? game.player1 : game.player2;
            setTimeout(() => {
              message.send({
                body: `Congratulation ${winner.name}, You are the winner of this match..`,
                mentions: [{ tag: winner.name, id: winner.id }]
              });
            }, 1000);
            game.on = false;
          } else if (game.counting === 8) {
            setTimeout(() => message.send("The match remains a draw....."), 1000);
            game.on = false;
          } else {
            game.counting++;
            message.unsend(event.messageReply.messageID);
            game.ttrns.push(input);
            game.turn = game.turn === game.player1.id ? game.player2.id : game.player1.id;
            game.bidd = game.bidd === "❌" ? "⭕" : "❌";
          }
        } else {
          message.reply("reply from 1-9");
        }
      } else {
        message.reply("not your turn Baka");
      }
    }
  }
        }
