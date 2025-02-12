const Game = require("../../models/games");
const axios = require("axios");

// interesting topic about concurrent calls from seperarte browsers
const updateLocks = {};

const findNextPosition = (startPosition, seats) => {
  const seatCount = seats.length;
  let nextPosition = (startPosition + 1) % seatCount;
  // Continue looping until a seat with a player is found.
  // (Be cautious: if no seats have a player, this could loop indefinitely.)
  while (!seats[nextPosition].player) {
    nextPosition = (nextPosition + 1) % seatCount;
  }
  return nextPosition;
};

const cardCode = (code) => code.replace("0", "10");

const fetchNewDeck = async () => {
  const response = await axios.get(
    "https://www.deckofcardsapi.com/api/deck/new/draw/?count=52"
  );
  return response.data.cards.map((card) => ({
    value: card.value,
    suit: card.suit,
    code: cardCode(card.code),
  }));
};

const resetActionNone = (game) => {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
};

const updatePositionsAndBlinds = async (gameId) => {
  // Check if an update for this game is already in progress.
  if (updateLocks[gameId]) {
    console.log(`Update for game ${gameId} is already in progress. Skipping logic.`);
    // Optionally, return the current game without updating.
    return await Game.findById(gameId);
  }

  // Acquire the lock for this game.
  updateLocks[gameId] = true;
  try {
    const game = await Game.findById(gameId);

    resetActionNone(game);

    if (!game) {
      throw new Error(`Game with ID: ${gameId} not found!`);
    }

    if (game.gameRunning) {
      console.log(`Game ${gameId} is already running. Skipping logic.`);
      return game;
    }

    if (game.currentDeck.length === 0) {
      console.log(`Fetching a new deck for game ${gameId}.`);
      game.currentDeck = await fetchNewDeck();
    }

    game.gameRunning = true;
    game.winnerData = [];
    game.communityCards = [];
    game.stage = "preflop";

    game.dealerPosition = findNextPosition(game.dealerPosition, game.seats);
    game.smallBlindPosition = findNextPosition(game.dealerPosition, game.seats);
    game.bigBlindPosition = findNextPosition(game.smallBlindPosition, game.seats);
    game.currentPlayerTurn = findNextPosition(game.bigBlindPosition, game.seats);

    const [smallBlindAmount, bigBlindAmount] = game.blinds.split("/").map(Number);

    game.seats.forEach((seat) => {
      if (seat.player) {
        seat.player.checkBetFold = false;
      }
    });

    if (game.seats[game.smallBlindPosition].player) {
      game.seats[game.smallBlindPosition].player.chips -= smallBlindAmount;
      game.pot += smallBlindAmount;
    }

    if (game.seats[game.bigBlindPosition].player) {
      game.seats[game.bigBlindPosition].player.chips -= bigBlindAmount;
      game.pot += bigBlindAmount;
    }

    game.gameEnd = false;

    await game.save();

    return game;
  } finally {
    // Release the lock.
    delete updateLocks[gameId];
  }
};

const dealCardsToPlayers = async (gameId) => {
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
};

const positionsAndBlindsSocket = (io, socket) => {
  socket.on("updatePositionsAndBlinds", async ({ gameId }) => {
    try {
      let game = await updatePositionsAndBlinds(gameId);
      game = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      console.log("Positions and blinds updated");
      // game = await dealCardsToPlayers(gameId);
      // console.log(`Updated positions, blinds, and dealt cards for game ${gameId}.
      //              Dealer: ${game.dealerPosition},
      //              Small Blind: ${game.smallBlindPosition},
      //              Big Blind: ${game.bigBlindPosition},
      //              Current Turn: ${game.currentPlayerTurn}`);
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error(`Error starting new round for game ${gameId}:`, error);
      socket.emit("gameError", error.message);
    }
  });
};

module.exports = positionsAndBlindsSocket;
