const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const allInSocket = (io, socket) => {
  socket.on("allIn", async (data) => {
    const { gameId, seatId } = data;
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[allInSocket] Game not found for id:", gameId);
        return socket.emit("playerAllInError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat || !seat.player) {
        console.error("[allInSocket] No player at seat:", seatId);
        return socket.emit("playerAllInError", {
          message: "No player at this seat",
        });
      }

      // For all-in, override betAmount to the player's total chips.
      const betAmount = seat.player.chips;
      game.highestBet = betAmount;

      // Reset checkBetFold and action for all other players.
      game.seats.forEach((s) => {
        if (s.player && s._id.toString() !== seatId) {
          s.player.checkBetFold = false;
          s.player.action = "none";
        }
      });

      // Update the player's state: deduct chips, update pot and bet, mark action.
      seat.player.chips -= betAmount;
      game.pot += betAmount;
      seat.player.bet += betAmount;
      seat.player.action = "all-in";
      seat.player.checkBetFold = true;

      await game.save();

      // Check if all players have acted. If so, proceed to the next stage.
      if (playersHaveActed(game, seatId, "all-in")) {
        console.log(
          "[allInSocket] All players have acted. Proceeding to next stage."
        );
        proceedToNextStage(game);
        await game.save();
      } else {
        // Otherwise, update the current player's turn.
        game.currentPlayerTurn = findNextPosition(
          game.currentPlayerTurn,
          game.seats
        );
      }

      await game.save();
      console.log("[allInSocket] Final game state saved.");

      // Re-fetch game with populated user data and emit update.
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[allInSocket] Error handling all-in:", error);
      socket.emit("playerAllInError", { error: "Failed to process all-in" });
    }
  });
};

module.exports = allInSocket;
