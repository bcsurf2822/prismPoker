const Game = require("../../models/games");
const {
  resetActionNone,
  findNextActivePlayer,
} = require("../../utils/dealHelpers");

const dealLocks = {};
// TURN
const dealTurnSocket = (io, socket) => {
  socket.on("deal_turn", async (data) => {
    console.log("[dealTurnSocket] Received 'deal_turn' event with data:", data);
    const { gameId } = data;

    if (dealLocks[gameId]) {
      console.log(
        `[dealTurnSocket] Deal turn already in progress for game ${gameId}. Skipping.`
      );
      return;
    }
    dealLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);
      console.log("[dealTurnSocket] Fetched game:", game);

      resetActionNone(game);
      console.log("[dealTurnSocket] resetActionNone called.");

      if (game.stage !== "turn" || game.communityCards.length > 3) {
        console.log("[dealTurnSocket] Conditions not met to deal the turn:", {
          stage: game.stage,
          communityCardsLength: game.communityCards.length,
        });
        return socket.emit("dealTurnError", {
          message: "Conditions not met to deal the turn!",
        });
      }

      // Reset checkBetFold for all players
      game.seats.forEach((seat, index) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
          console.log(`[dealTurnSocket] Reset checkBetFold for seat ${index}`);
        }
      });

      // Burn one card
      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      console.log("[dealTurnSocket] Burn card:", burnCard);
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 1) {
        console.log(
          "[dealTurnSocket] Not enough cards to deal the turn. Current deck length:",
          game.currentDeck.length
        );
        return socket.emit("dealTurnError", {
          message: "Not enough cards to deal the turn!",
        });
      }

      // Deal one card for the turn
      const turnCard = game.currentDeck.splice(0, 1)[0];
      console.log("[dealTurnSocket] Turn card dealt:", turnCard);
      game.dealtCards.push(turnCard.code);
      game.communityCards.push({
        value: turnCard.value,
        suit: turnCard.suit,
        code: turnCard.code,
      });

      // Reset bets and set the next player's turn
      game.highestBet = 0;
      game.betPlaced = false;
      const nextPlayer = findNextActivePlayer(game, game.dealerPosition + 1);
      console.log("[dealTurnSocket] Next active player position:", nextPlayer);
      game.currentPlayerTurn = nextPlayer;

      await game.save();
      console.log("[dealTurnSocket] Game saved successfully");

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      console.log(
        "[dealTurnSocket] Emitting 'gameUpdated' event with updated game state"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[dealTurnSocket] Error dealing turn:", error);
      socket.emit("dealTurnError", { error: "Failed to deal the turn" });
    } finally {
      delete dealLocks[gameId];
      console.log(`[dealTurnSocket] Released lock for game ${gameId}`);
    }
  });
};

module.exports = dealTurnSocket;
