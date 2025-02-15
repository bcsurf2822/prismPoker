const Game = require("../../models/games");

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}

function findNextActivePlayer(game, startingPosition) {
  let nextPosition = startingPosition % game.seats.length;
  while (
    game.seats[nextPosition].player == null ||
    game.seats[nextPosition].player.handCards.length === 0
  ) {
    nextPosition = (nextPosition + 1) % game.seats.length;
  }

  return nextPosition;
}

// RIVER
const dealRiverSocket = (io, socket) => {
  socket.on("deal_river", async (data) => {
    const { gameId } = data;
    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (
        game.currentDeck.length < 2 ||
        game.stage !== "river" ||
        game.communityCards.length > 4
      ) {
        return socket.emit("dealRiverError", {
          message: "Conditions not met to deal the river!",
        });
      }

      // Reset checkBetFold for all players
      game.seats.forEach((seat) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      // Burn one card
      const burntCard = game.currentDeck.shift().code;
      game.dealtCards.push(burntCard);

      // Deal one card for the river
      const riverCard = game.currentDeck.shift().code;
      game.dealtCards.push(riverCard);
      game.communityCards.push(riverCard);

      // Reset bets and set the next player's turn
      game.highestBet = 0;
      game.betPlaced = false;
      game.currentPlayerTurn = findNextActivePlayer(
        game,
        game.dealerPosition + 1
      );

      await game.save();

      // Emit updated game state to all clients
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error("Error dealing river:", error);
      socket.emit("dealRiverError", { error: "Failed to deal the river" });
    }
  });
};

module.exports = dealRiverSocket;
