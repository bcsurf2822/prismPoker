const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const raiseSocket = (io, socket) => {
  socket.on("raise", async (data) => {
    const { gameId, seatId, bet } = data;
    const additionalRaise = Number(bet);
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

      if (additionalRaise <= 0) {
        console.error("[raiseSocket] Raise amount must be greater than 0");
        return socket.emit("playerRaiseError", {
          message: "Raise amount must be greater than 0",
        });
      }

      // Calculate the new highest bet.
      const newHighestBet = game.highestBet + additionalRaise;
      console.log(
        "[raiseSocket] Current highestBet:",
        game.highestBet,
        "Additional raise:",
        additionalRaise,
        "New highestBet:",
        newHighestBet
      );
      game.highestBet = newHighestBet;

      // Reset temporary flags for all other players.
      game.seats.forEach((s) => {
        if (s.player && s._id.toString() !== seatId) {
          s.player.checkBetFold = false;
          s.player.action = "none";
        }
      });

      // Deduct only the additional raise from the player's chips.
      seat.player.chips -= additionalRaise;
      game.pot += additionalRaise;
      seat.player.bet += additionalRaise;
      seat.player.action = "raise";
      seat.player.checkBetFold = true;

      await game.save();

      // Check if all players have acted.
      const allHaveActed = playersHaveActed(game);
      if (allHaveActed) {
        console.log("[raiseSocket] All players have acted. Proceeding to next stage.");
        proceedToNextStage(game);
        await game.save();
      } else {
        game.currentPlayerTurn = findNextPosition(game.currentPlayerTurn, game.seats);
      }

      await game.save();
      console.log("[raiseSocket] Final game state saved.");

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