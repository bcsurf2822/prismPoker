const Game = require("../../models/games");
const axios = require("axios");

const findNextPosition = (startPosition, seats) => {
  let seatCount = seats.length;
  let nextPosition = (startPosition + 1) % seatCount;
  while (!seats[nextPosition].player) {
    nextPosition = (nextPosition + 1) % seatCount;
  }
  return nextPosition;
};

function cardCode(code) {
  return code.replace("0", "10");
}

async function fetchNewDeck() {
  const response = await axios.get(
    "https://www.deckofcardsapi.com/api/deck/new/draw/?count=52"
  );
  return response.data.cards.map((card) => ({
    value: card.value,
    suit: card.suit,
    code: cardCode(card.code),
  }));
}

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}


async function updatePositionsAndBlinds(gameId) {
  const game = await Game.findById(gameId);

  resetActionNone(game);

  if (!game) {
    throw new Error(`Game with ID: ${gameId} not found!`);
  }

  if (game.gameRunning) {
    console.log(`Game ${gameId} is already running. Skipping logic.`);
    return game;
  }

  if (!game.gameEnd) {
    console.log(`Game ${gameId} has not ended yet. Skipping logic.`);
    return game;
  }

  if (game.currentDeck.length === 0) {
    console.log(`Fetching a new deck for game ${gameId}.`);
    game.currentDeck = await fetchNewDeck();
  }
game.winnerData = {};
  game.communityCards = [];
  game.stage = "preflop";

  game.dealerPosition = findNextPosition(game.dealerPosition, game.seats);
  game.smallBlindPosition = findNextPosition(game.dealerPosition, game.seats);
  game.bigBlindPosition = findNextPosition(game.smallBlindPosition, game.seats);
  game.currentPlayerTurn = findNextPosition(game.bigBlindPosition, game.seats);

  const [smallBlindAmount, bigBlindAmount] = game.blinds.split("/").map(Number);

  for (let seat of game.seats) {
    if (seat.player) {
      seat.player.checkBetFold = false;
    }
  }

  if (game.seats[game.smallBlindPosition].player) {
    game.seats[game.smallBlindPosition].player.chips -= smallBlindAmount;
    game.pot += smallBlindAmount;
  }

  if (game.seats[game.bigBlindPosition].player) {
    game.seats[game.bigBlindPosition].player.chips -= bigBlindAmount;
    game.pot += bigBlindAmount;
  }

  game.gameRunning = true;
  game.gameEnd = false;
  

  await game.save();

  return game;
}

async function dealCardsToPlayers(gameId) {
  const game = await Game.findById(gameId);

  if (!game) {
    throw new Error(`Game with ID: ${gameId} not found!`);
  }

  const seatsWithPlayers = game.seats.filter((seat) => seat.player !== null);
  const numberOfPlayers = seatsWithPlayers.length;

  if (numberOfPlayers * 2 > game.currentDeck.length) {
    throw new Error("Not enough cards to deal!");
  }

  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.handCards = [];
      seat.player.checkBetFold = false;
    }
  });

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < numberOfPlayers; j++) {
      const playerIndex = (game.bigBlindPosition + 1 + j) % numberOfPlayers;
      const seat = seatsWithPlayers[playerIndex];
      const card = game.currentDeck.shift();
      seat.player.handCards.push(card.code);
    }
  }

  await game.save();

  return game;
}

function positionsAndBlindsSocket(socket, io) {
  socket.on("updatePositionsAndBlinds", async ({ gameId }) => {
    try {
      let game = await updatePositionsAndBlinds(gameId);
      game = await dealCardsToPlayers(gameId);

      console.log(`Updated positions, blinds, and dealt cards for game ${gameId}. 
                   Dealer: ${game.dealerPosition}, 
                   Small Blind: ${game.smallBlindPosition}, 
                   Big Blind: ${game.bigBlindPosition}, 
                   Current Turn: ${game.currentPlayerTurn}`);

      io.emit("positions_and_blinds", game);
    } catch (error) {
      console.error(`Error starting new round for game ${gameId}:`, error);
      socket.emit("error", error.message);
    }
  });
}

module.exports = positionsAndBlindsSocket;
