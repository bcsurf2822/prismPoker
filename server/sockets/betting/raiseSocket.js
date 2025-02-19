const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const raiseSocket = (io, socket) => {
  socket.on("raise", async (data) => {
    const { gameId, seatId, bet } = data;
    let betAmount = Number(bet);
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[raiseSocket] Game not found for id:", gameId);
        return socket.emit("playerRaiseError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat || !seat.player) {
        console.error("[raiseSocket] No player at seat:", seatId);
        return socket.emit("playerRaiseError", {
          message: "No player at this seat",
        });
      }

      // Validate that the raise amount is greater than the current highest bet.
      if (betAmount <= game.highestBet) {
        console.error(
          "[raiseSocket] Raise must be higher than the current highest bet:",
          betAmount,
          game.highestBet
        );
        return socket.emit("playerRaiseError", {
          message: "Raise must be higher than the current highest bet",
        });
      }

      // Update the game's highest bet with the new raise.
      game.highestBet = betAmount;

      // Reset temporary flags (checkBetFold and action) for all other players.
      game.seats.forEach((s) => {
        if (s.player && s._id.toString() !== seatId) {
          s.player.checkBetFold = false;
          s.player.action = "none";
        }
      });

      // Deduct the raise amount from the player's chips, update the pot and player's bet.
      seat.player.chips -= betAmount;
      game.pot += betAmount;
      seat.player.bet += betAmount;
      seat.player.action = "raise";
      seat.player.checkBetFold = true;

      await game.save();

      // Check if all players have acted.
      const allHaveActed = playersHaveActed(game, seatId, "raise");
      if (allHaveActed) {
        console.log(
          "[raiseSocket] All players have acted. Proceeding to next stage."
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
      console.log("[raiseSocket] Final game state saved.");

      // Emit the updated game to all clients.
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", updatedGame);
    } catch (error) {
      console.error("[raiseSocket] Error handling player raise:", error);
      socket.emit("playerRaiseError", { error: "Failed to process raise" });
    }
  });
};

module.exports = raiseSocket;
