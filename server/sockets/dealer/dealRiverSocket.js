const Game = require("../../models/games");
const {
  resetActionNone,
  findNextActivePlayer,
} = require("../../utils/dealHelpers");

const dealLocks = {};

// RIVER
const dealRiverSocket = (io, socket) => {
  socket.on("dealRiver", async (data) => {
    console.log(
      "[dealRiverSocket] Received 'deal_river' event with data:",
      data
    );
    const { gameId } = data;

    if (dealLocks[gameId]) {
      console.log(
        `[dealRiverSocket] Deal river already in progress for game ${gameId}. Skipping.`
      );
      return;
    }
    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);
      console.log("[dealRiverSocket] Fetched game:", game);

      resetActionNone(game);
      console.log("[dealRiverSocket] resetActionNone called.");

      if (game.stage !== "river" || game.communityCards.length > 4) {
        console.log("[dealRiverSocket] Conditions not met to deal the river:", {
          stage: game.stage,
          communityCardsLength: game.communityCards.length,
        });
        return socket.emit("dealRiverError", {
          message: "Conditions not met to deal the river!",
        });
      }

      // Reset checkBetFold for all players
      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
          console.log(`[dealRiverSocket] Reset checkBetFold for seat ${index}`);
        }
      });

      // Burn one card
      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      console.log("[dealRiverSocket] Burn card:", burnCard);
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 1) {
        console.log(
          "[dealRiverSocket] Not enough cards to deal the river. Current deck length:",
          game.currentDeck.length
        );
        return socket.emit("dealRiverError", {
          message: "Not enough cards to deal the river!",
        });
      }

      // Deal one card for the river
      const riverCard = game.currentDeck.splice(0, 1)[0];
      console.log("[dealRiverSocket] River card dealt:", riverCard);
      game.dealtCards.push(riverCard.code);
      game.communityCards.push({
        value: riverCard.value,
        suit: riverCard.suit,
        code: riverCard.code,
      });

      // Reset bets and set the next player's turn
      game.highestBet = 0;
      game.betPlaced = false;
      const nextPlayer = findNextActivePlayer(game, game.dealerPosition + 1);
      console.log("[dealRiverSocket] Next active player position:", nextPlayer);
      game.currentPlayerTurn = nextPlayer;

      await game.save();
      console.log("[dealRiverSocket] Game saved successfully");

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      console.log(
        "[dealRiverSocket] Emitting 'gameUpdated' event with updated game state"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[dealRiverSocket] Error dealing river:", error);
      socket.emit("dealRiverError", { error: "Failed to deal the river" });
    } finally {
      delete dealLocks[gameId];
      console.log(`[dealRiverSocket] Released lock for game ${gameId}`);
    }
  });
};

module.exports = dealRiverSocket;
