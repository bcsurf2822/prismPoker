const Game = require("../../models/games");
const {
  resetPlayerActions,
  findNextPosition,
} = require("../../utils/actionHelpers");
const fetchNewDeck = require("../../utils/deckOfCardsAPI");

const updateLocks = {};

const positionsAndBlindsSocket = (io, socket) => {
  socket.on("updatePositionsAndBlinds", async ({ gameId }) => {
    if (updateLocks[gameId]) {
      return;
    }
    updateLocks[gameId] = true;
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        throw new Error(`Game with ID: ${gameId} not found!`);
      }

      resetPlayerActions(game);

      if (game.gameRunning) {
        return game;
      }

      if (game.currentDeck.length === 0) {
        game.currentDeck = await fetchNewDeck();
      }

      game.gameRunning = true;
      game.winnerData = [];
      game.stage = "preflop";

      game.dealerPosition = findNextPosition(game.dealerPosition, game.seats);
      game.smallBlindPosition = findNextPosition(
        game.dealerPosition,
        game.seats
      );
      game.bigBlindPosition = findNextPosition(
        game.smallBlindPosition,
        game.seats
      );
      game.currentPlayerTurn = findNextPosition(
        game.bigBlindPosition,
        game.seats
      );

      const [smallBlindAmount, bigBlindAmount] = game.blinds
        .split("/")
        .map(Number);
      if (game.seats[game.smallBlindPosition].player) {
        game.seats[game.smallBlindPosition].player.chips -= smallBlindAmount;
        game.pot += smallBlindAmount;
      }
      if (game.seats[game.bigBlindPosition].player) {
        game.seats[game.bigBlindPosition].player.chips -= bigBlindAmount;
        game.pot += bigBlindAmount;
      }

      game.highestBet = bigBlindAmount;

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error(`Error starting new round for game ${gameId}:`, error);
      socket.emit("gameError", error.message);
    } finally {
      delete updateLocks[gameId];
    }
  });
};

module.exports = positionsAndBlindsSocket;
