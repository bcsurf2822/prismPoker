const Game = require("../../models/games");
const {
  resetActionNone,
  findNextActivePlayer,
} = require("../../utils/dealHelpers");

const dealLocks = {};

// RIVER
const dealRiverSocket = (io, socket) => {
  socket.on("dealRiver", async (data) => {
    const { gameId } = data;

    if (dealLocks[gameId]) {
      return;
    }
    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (game.stage !== "river" || game.communityCards.length > 4) {
        return socket.emit("dealRiverError", {
          message: "Conditions not met to deal the river!",
        });
      }

      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 1) {
        return socket.emit("dealRiverError", {
          message: "Not enough cards to deal the river!",
        });
      }

      const riverCard = game.currentDeck.splice(0, 1)[0];

      game.dealtCards.push(riverCard.code);
      game.communityCards.push({
        value: riverCard.value,
        suit: riverCard.suit,
        code: riverCard.code,
      });

      game.highestBet = 0;
      game.betPlaced = false;
      const nextPlayer = findNextActivePlayer(game, game.dealerPosition + 1);
      console.log("[dealRiverSocket] Next active player position:", nextPlayer);
      game.currentPlayerTurn = nextPlayer;

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[dealRiverSocket] Error dealing river:", error);
      socket.emit("dealRiverError", { error: "Failed to deal the river" });
    } finally {
      delete dealLocks[gameId];
    }
  });
};

module.exports = dealRiverSocket;
