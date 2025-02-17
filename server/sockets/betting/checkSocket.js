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
        return socket.emit("checkError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat) {
        return socket.emit("checkError", { message: "Seat not found!" });
      }
      if (!seat.player) {
        return socket.emit("checkError", { message: "No Player At Seat" });
      }

      seat.player.action = action;
      seat.player.checkBetFold = true;
      await game.save();

      if (playersHaveActed(game, seatId, action)) {
        proceedToNextStage(game);
        await game.save();
      }

      game.currentPlayerTurn = findNextPosition(
        game.currentPlayerTurn,
        game.seats
      );

      await game.save();

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
