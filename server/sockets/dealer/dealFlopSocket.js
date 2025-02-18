const Game = require("../../models/games");
const { findNextActivePlayer } = require("../../utils/actionHelpers");

const dealLocks = {};

// FLOP
const dealFlopSocket = (io, socket) => {
  socket.on("dealFlop", async (data) => {
    const { gameId } = data;

    if (dealLocks[gameId]) {
      return;
    }

    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);

      if (
        game.stage !== "flop" ||
        game.stage !== "defaultShowdown" ||
        game.communityCards.length > 0
      ) {
        return socket.emit("dealFlopError", {
          message: "Conditions not met to deal the flop!",
        });
      }

      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 3) {
        return socket.emit("dealFlopError", {
          message: "Not enough cards to deal the flop!",
        });
      }

      const flopCards = game.currentDeck.splice(0, 3).map((card) => ({
        value: card.value,
        suit: card.suit,
        code: card.code,
      }));

      game.dealtCards.push(...flopCards.map((card) => card.code));
      game.communityCards.push(...flopCards);

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
      console.error("[dealFlopSocket] Error dealing flop:", error);
      socket.emit("dealFlopError", { error: "Failed to deal the flop" });
    } finally {
      delete dealLocks[gameId];
    }
  });
};

module.exports = dealFlopSocket;
