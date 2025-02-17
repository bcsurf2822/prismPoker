const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const foldSocket = (io, socket) => {
  socket.on("fold", async (data) => {
    console.log("[foldSocket] Received fold event with data:", data);
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
      console.log("[foldSocket] Updated player state after fold:", seat.player);

      await game.save();
      console.log("[foldSocket] Game saved after fold action.");

      // Check if only one player remains active
      const playersActive = game.seats.filter(
        (seat) => seat.player && seat.player.handCards.length > 0
      );
      if (playersActive.length === 1) {
        console.log("[foldSocket] Only one active player remains. Setting stage to 'surrender'.");
        game.stage = "surrender";
        await game.save();
        const updatedGame = await Game.findById(gameId).populate("seats.player.user", "username");
        return io.emit("gameUpdated", updatedGame);
      }

      // Check if all players have acted; if so, proceed to next stage
      if (playersHaveActed(game, seatId, action)) {
        console.log("[foldSocket] All players have acted; proceeding to next stage.");
        proceedToNextStage(game);
        await game.save();
        console.log("[foldSocket] Game saved after advancing stage:", game.stage);
      }

      // Determine the next active player's turn
      game.currentPlayerTurn = findNextPosition(game.currentPlayerTurn, game.seats);
      console.log("[foldSocket] Next player's turn determined:", game.currentPlayerTurn);

      // Loop until a seat with a player and cards is found
      while (
        !game.seats[game.currentPlayerTurn].player ||
        game.seats[game.currentPlayerTurn].player.handCards.length === 0
      ) {
        game.currentPlayerTurn = findNextPosition(game.currentPlayerTurn, game.seats);
      }

      await game.save();
      console.log("[foldSocket] Final game state saved.");

      const updatedGame = await Game.findById(gameId).populate("seats.player.user", "username");
      console.log("[foldSocket] Emitting gameUpdated event with game:", updatedGame);
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[foldSocket] Error handling fold:", error);
      socket.emit("foldError", { error: "Failed to handle the fold" });
    }
  });
};

module.exports = foldSocket;