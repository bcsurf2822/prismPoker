const Game = require("../../models/games");
const axios = require("axios");

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
};

const positionsAndBlindsSocket = (io, socket) => {
  socket.on("updatePositionsAndBlinds", async ({ gameId }) => {
    try {
      let game = await updatePositionsAndBlinds(gameId);
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
