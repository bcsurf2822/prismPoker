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

const dealLocks = {};

// FLOP
const dealFlopSocket = (io, socket) => {
  socket.on("dealFlop", async (data) => {
    console.log("[dealFlopSocket] Received 'dealFlop' event with data:", data);
    const { gameId } = data;

    // Check if a deal is already in progress for this game
    if (dealLocks[gameId]) {
      console.log(
        `[dealFlopSocket] Deal flop already in progress for game ${gameId}. Skipping.`
      );
      return;
    }
    // Set the lock for this gameId
    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);
      console.log("[dealFlopSocket] Fetched game:", game);

      resetActionNone(game);
      console.log("[dealFlopSocket] resetActionNone called.");

      if (game.stage !== "flop" || game.communityCards.length > 0) {
        console.log("[dealFlopSocket] Conditions not met to deal the flop:", {
          stage: game.stage,
          communityCardsLength: game.communityCards.length,
        });
        return socket.emit("dealFlopError", {
          message: "Conditions not met to deal the flop!",
        });
      }

      // Reset checkBetFold for all players
      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
          console.log(`[dealFlopSocket] Reset checkBetFold for seat ${index}`);
        }
      });

      // Burn one card
      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      console.log("[dealFlopSocket] Burn card:", burnCard);
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 3) {
        console.log(
          "[dealFlopSocket] Not enough cards to deal the flop. Current deck length:",
          game.currentDeck.length
        );
        return socket.emit("dealFlopError", {
          message: "Not enough cards to deal the flop!",
        });
      }

      // Deal three cards for the flop (instead of 2)
      const flopCards = game.currentDeck.splice(0, 3).map((card) => ({
        value: card.value,
        suit: card.suit,
        code: card.code,
      }));
      console.log("[dealFlopSocket] Flop cards dealt:", flopCards);

      game.dealtCards.push(...flopCards.map((card) => card.code));
      game.communityCards.push(...flopCards);

      // Reset bets and set the next player's turn
      game.highestBet = 0;
      game.betPlaced = false;
      const nextPlayer = findNextActivePlayer(game, game.dealerPosition + 1);
      console.log("[dealFlopSocket] Next active player position:", nextPlayer);
      game.currentPlayerTurn = nextPlayer;

      await game.save();
      console.log("[dealFlopSocket] Game saved successfully");
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[dealFlopSocket] Error dealing flop:", error);
      socket.emit("dealFlopError", { error: "Failed to deal the flop" });
    } finally {
      // Release the lock so that subsequent calls can proceed
      delete dealLocks[gameId];
      console.log(`[dealFlopSocket] Released lock for game ${gameId}`);
    }
  });
};

module.exports = dealFlopSocket;
