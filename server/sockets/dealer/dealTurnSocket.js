const Game = require("../../models/games");
const { findNextActivePlayer } = require("../../utils/actionHelpers");

const dealLocks = {};
// TURN
const dealTurnSocket = (io, socket) => {
  socket.on("dealTurn", async (data) => {
    const { gameId } = data;

    if (dealLocks[gameId]) {
      return;
    }
    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);

      if (
        (game.stage !== "turn" && game.stage !== "defaultShowdown")  ||
        game.communityCards.length > 3
      ) {
        return socket.emit("dealTurnError", {
          message: "Conditions not met to deal the turn!",
        });
      }

      // Reset checkBetFold for all players
      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      // Burn one card
      const burnCard = game.currentDeck.splice(0, 1)[0].code;

      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 1) {
        return socket.emit("dealTurnError", {
          message: "Not enough cards to deal the turn!",
        });
      }

      const turnCard = game.currentDeck.splice(0, 1)[0];

      game.dealtCards.push(turnCard.code);
      game.communityCards.push({
        value: turnCard.value,
        suit: turnCard.suit,
        code: turnCard.code,
      });

      game.highestBet = 0;
      game.betPlaced = false;
      const nextPlayer = findNextActivePlayer(game, game.dealerPosition + 1);

      game.currentPlayerTurn = nextPlayer;

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[dealTurnSocket] Error dealing turn:", error);
      socket.emit("dealTurnError", { error: "Failed to deal the turn" });
    } finally {
      delete dealLocks[gameId];
    }
  });
};

module.exports = dealTurnSocket;
