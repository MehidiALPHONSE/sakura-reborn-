const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

let activeGames = {};

module.exports = {
  config: {
    name: "playcard",
    version: "1.0",
    author: "kshitiz",
    role: 0,
    shortDescription: "Play card game",
    longDescription: "Play card game .",
    category: "game",
    guide: {}
  },

  onStart: async function ({ event, message, usersData, api }) {
    const mention = Object.keys(event.mentions);
    if (mention.length !== 1) {
      return message.reply("Please mention a user to start the game.");
    }

    const threadID = event.threadID;
    const mentionedUserID = mention[0];

    const cards = generateCards();
    const shuffledCards = shuffle(cards);

    activeGames[threadID] = {
      players: [event.senderID, mentionedUserID],
      playerCards: shuffledCards.slice(0, 26),
      mentionedUserCards: shuffledCards.slice(26),
      currentPlayerIndex: 0,
      messageId: message.messageID,
      threadID
    };

    await message.reply("Game started! Players have received their cards. Type `throw` to begin.");
  },

  onChat: async function ({ event, message, usersData, api }) {
    const threadID = event.threadID;
    const gameState = activeGames[threadID];

    if (!gameState || gameState.messageId !== message.messageID) return;

    if (event.body.trim().toLowerCase() !== 'throw') return;

    const currentPlayerID = gameState.players[gameState.currentPlayerIndex];
    const opponentPlayerIndex = 1 - gameState.currentPlayerIndex;

    if (event.senderID !== currentPlayerID) return;

    const currentPlayerCards = gameState.currentPlayerIndex === 0 ? gameState.playerCards : gameState.mentionedUserCards;
    const currentCard = currentPlayerCards.shift(); 

    const currentCardImage = await generateCardImage(currentCard);
    const currentCardPath = await saveImageToCache(currentCardImage);

    await message.reply({ attachment: fs.createReadStream(currentCardPath) });

    if (currentPlayerCards.length === 0) {
     s
      gameState.currentPlayerIndex = -1;
    } else {
      gameState.currentPlayerIndex = opponentPlayerIndex; 
    }
  }
};

function generateCards() {
  const suits = ['♥', '♦', '♣', '♠'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const cards = [];
  for (const suit of suits) {
    for (const value of values) {
      cards.push({ suit, value });
    }
  }
  return cards;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generateCardImage(card) {
  const canvas = createCanvas(200, 300);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, true, false);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, false, true);

  ctx.font = 'bold 72px Arial';
  ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  ctx.textAlign = 'center';
  ctx.fillText(card.suit, canvas.width / 2, canvas.height / 2 + 15);

  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  ctx.textAlign = 'left';
  ctx.fillText(card.value, 15, 40);
  ctx.fillText(card.suit, 15, 70);

  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  ctx.textAlign = 'right';
  ctx.fillText(card.value, canvas.width - 15, canvas.height - 15);
  ctx.fillText(card.suit, canvas.width - 15, canvas.height - 45);

  return canvas.toBuffer();
}

async function saveImageToCache(imageBuffer) {
  const imagePath = path.join(cacheDir, `card_${Date.now()}.png`);
  await fs.promises.writeFile(imagePath, imageBuffer);
  return imagePath;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
