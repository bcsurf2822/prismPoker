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

      // Ensure there is a deck; if not, fetch a new one
      if (game.currentDeck.length === 0) {
        game.currentDeck = await fetchNewDeck();
      }

      // Set up the game for a new round
      game.gameRunning = true;
      game.winnerData = [];
      game.stage = "preflop";

      // Determine positions using our helper function
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

      // Deduct blinds and update the pot
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

      game.gameEnd = false;

      // Save updated game state
      await game.save();

      // Re-fetch the game with populated user data
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error(`Error starting new round for game ${gameId}:`, error);
      socket.emit("gameError", error.message);
    } finally {
      // Release the lock so subsequent calls can proceed
      delete updateLocks[gameId];
      console.log(
        `[updatePositionsAndBlinds] Released lock for game ${gameId}`
      );
    }
  });
};

module.exports = positionsAndBlindsSocket;
