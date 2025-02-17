const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const callSocket = (io, socket) => {
  socket.on("call", async (data) => {
    const { gameId, seatId, action, bet } = data;
    const callAmount = Number(bet);
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[callSocket] Game not found for id:", gameId);
        return socket.emit("playerCallError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat) {
        console.error("[callSocket] Seat not found for seat id:", seatId);
        return socket.emit("playerCallError", { message: "Seat not Found!" });
      }
      if (!seat.player) {
        console.error("[callSocket] No player at seat:", seatId);
        return socket.emit("playerCallError", {
          message: "No Player at this Seat",
        });
      }

      if (seat.player.chips < callAmount) {
        console.error(
          "[callSocket] Not enough chips: Player chips =",
          seat.player.chips,
          "callAmount =",
          callAmount
        );
        return socket.emit("playerCallError", {
          message: "Not Enough Chips to Call",
        });
      }

      console.log(
        "[callSocket] Before calling - pot:",
        game.pot,
        "callAmount:",
        callAmount,
        "playerChips:",
        seat.player.chips
      );

      seat.player.chips -= callAmount;
      game.pot += callAmount;

      seat.player.bet += callAmount;
      seat.player.action = action;
      seat.player.checkBetFold = true;

      await game.save();

      if (playersHaveActed(game, seatId)) {
        proceedToNextStage(game);
        await game.save();
      } else {
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
      }

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[callSocket] Error handling player call:", error);
      socket.emit("playerCallError", { error: "Failed to call bet" });
    }
  });
};

module.exports = callSocket;
