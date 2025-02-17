const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

// need to add proceed to next stage for more then 2 players

const foldSocket = (io, socket) => {
  socket.on("fold", async (data) => {
    const { gameId, seatId, action } = data;

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[foldSocket] Game not found for id:", gameId);
        return socket.emit("foldError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat) {
        console.error("[foldSocket] Seat not found for id:", seatId);
        return socket.emit("foldError", { message: "Seat not found!" });
      }

      if (!seat.player) {
        console.error("[foldSocket] No player at seat:", seatId);
        return socket.emit("foldError", { message: "No Player At Seat" });
      }

      seat.player.handCards = [];
      seat.player.action = action;
      seat.player.checkBetFold = true;

      await game.save();

      const playersActive = game.seats.filter(
        (seat) => seat.player && seat.player.handCards.length > 0
      );
      if (playersActive.length === 1) {
        game.stage = "surrender";
        await game.save();
        const updatedGame = await Game.findById(gameId).populate(
          "seats.player.user",
          "username"
        );
        return io.emit("gameUpdated", updatedGame);
      }

      if (playersHaveActed(game, seatId, action)) {
        await game.save();
      }

      game.currentPlayerTurn = findNextPosition(
        game.currentPlayerTurn,
        game.seats
      );

      while (
        !game.seats[game.currentPlayerTurn].player ||
        game.seats[game.currentPlayerTurn].player.handCards.length === 0
      ) {
        game.currentPlayerTurn = findNextPosition(
          game.currentPlayerTurn,
          game.seats
        );
      }

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[foldSocket] Error handling fold:", error);
      socket.emit("foldError", { error: "Failed to handle the fold" });
    }
  });
};

module.exports = foldSocket;
