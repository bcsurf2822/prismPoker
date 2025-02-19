const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const betSocket = (io, socket) => {
  socket.on("bet", async (data) => {
    const { gameId, seatId, bet, action } = data; // action should be "bet"
    let betAmount = Number(bet);
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[betSocket] Game not found for id:", gameId);
        return socket.emit("playerBetError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat || !seat.player) {
        console.error("[betSocket] No player at seat:", seatId);
        return socket.emit("playerBetError", {
          message: "No Player at this Seat",
        });
      }

      if (!betAmount || isNaN(betAmount) || seat.player.chips < betAmount) {
        console.error(
          "[betSocket] Invalid bet or not enough chips:",
          betAmount
        );
        return socket.emit("playerBetError", {
          message: "Invalid Bet or Not Enough Chips",
        });
      }

      // For a standard "bet", update the highest bet and reset other players’ temporary flags.
      if (action === "bet") {
        game.highestBet = betAmount;
        game.seats.forEach((s) => {
          if (s.player && s._id.toString() !== seatId) {
            s.player.checkBetFold = false;
            s.player.action = "none";
          }
        });
      }

      // Update the player's state with the bet.
      seat.player.chips -= betAmount;
      game.pot += betAmount;
      seat.player.bet += betAmount;
      seat.player.action = action; // "bet"
      seat.player.checkBetFold = true;

      await game.save();

      // Check if all players have acted.
      const allHaveActed = playersHaveActed(game, seatId, action);
      if (allHaveActed) {
        console.log(
          "[betSocket] All players have acted. Proceeding to next stage."
        );
        proceedToNextStage(game);
        await game.save();
      } else {
        game.currentPlayerTurn = findNextPosition(
          game.currentPlayerTurn,
          game.seats
        );
      }

      await game.save();
      console.log("[betSocket] Final game state saved.");

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[betSocket] Error handling player bet:", error);
      socket.emit("playerBetError", { error: "Failed to place bet" });
    }
  });
};

module.exports = betSocket;
