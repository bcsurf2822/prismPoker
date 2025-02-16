const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const checkSocket = (io, socket) => {
  socket.on("check", async (data) => {
    const { gameId, seatId, action } = data;
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.log("[checkSocket] Game not found for id:", gameId);
        return socket.emit("checkError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat) {
        console.log("[checkSocket] Seat not found for id:", seatId);
        return socket.emit("checkError", { message: "Seat not found!" });
      }
      if (!seat.player) {
        console.log("[checkSocket] No player at seat:", seatId);
        return socket.emit("checkError", { message: "No Player At Seat" });
      }

      // Update player's action and mark as having checked
      seat.player.action = action;
      seat.player.checkBetFold = true;
      await game.save();
      console.log("[checkSocket] Updated seat action and saved game.");

      // If all players have acted, proceed to the next stage.
      if (playersHaveActed(game, seatId, action)) {
        console.log(
          "[checkSocket] All players have acted. Proceeding to next stage."
        );
        proceedToNextStage(game);
        await game.save();
      }

      // Set the next player's turn.
      game.currentPlayerTurn = findNextPosition(
        game.currentPlayerTurn,
        game.seats
      );
      console.log(
        "[checkSocket] Next active player position determined:",
        game.currentPlayerTurn
      );

      await game.save();
      console.log("[checkSocket] Game saved successfully after check.");
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[checkSocket] Error handling check:", error);
      socket.emit("checkError", { error: "Failed to handle the check" });
    }
  });
};

module.exports = checkSocket;
