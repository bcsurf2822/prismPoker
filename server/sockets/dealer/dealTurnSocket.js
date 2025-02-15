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

// TURN

const dealTurnSocket = (io, socket) => {
  socket.on("deal_turn", async (data) => {
    const { gameId } = data;
    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (
        game.currentDeck.length < 2 ||
        game.stage !== "turn" ||
        game.communityCards.length > 3
      ) {
        return socket.emit("dealTurnError", {
          message: "Conditions not met to deal the turn!",
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

      // Deal one card for the turn
      const turnCard = game.currentDeck.shift().code;
      game.dealtCards.push(turnCard);
      game.communityCards.push(turnCard);

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
      console.error("Error dealing turn:", error);
      socket.emit("dealTurnError", { error: "Failed to deal the turn" });
    }
  });
};

module.exports = dealTurnSocket;
