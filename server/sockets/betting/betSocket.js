const Game = require("../../models/games");
const {
  playersHaveActed,
  findNextPosition,
  proceedToNextStage,
} = require("../../utils/actionHelpers");

const playerBetSocket = (io, socket) => {
  socket.on("player_bet", async (data) => {
    console.log("[playerBetSocket] Received player_bet event with data:", data);
    const { gameId, seatId, bet, action } = data;
    let betAmount = Number(bet);
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("[playerBetSocket] Game not found for id:", gameId);
        return socket.emit("playerBetError", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat || !seat.player) {
        console.error("[playerBetSocket] No player at seat:", seatId);
        return socket.emit("playerBetError", {
          message: "No Player at this Seat",
        });
      }

      if (
        !betAmount ||
        isNaN(betAmount) ||
        (seat.player.chips < betAmount && action !== "all-in")
      ) {
        console.error(
          "[playerBetSocket] Invalid bet or not enough chips:",
          betAmount
        );
        return socket.emit("playerBetError", {
          message: "Invalid Bet or Not Enough Chips",
        });
      }

      // Handle bet, raise, and all-in actions.
      if (action === "all-in") {
        betAmount = bet; // using the provided bet (might be a string)
      }
      if (action === "bet" || action === "raise") {
        if (action === "raise" && betAmount <= game.highestBet) {
          console.error(
            "[playerBetSocket] Raise must be higher than the current highest bet:",
            betAmount,
            game.highestBet
          );
          return socket.emit("playerBetError", {
            message: "Raise must be higher than the current highest bet",
          });
        }
        console.log(
          `[playerBetSocket] Handling ${action} action, betAmount: ${betAmount}`
        );
        game.highestBet = betAmount;
        // Reset checkBetFold for all other players.
        game.seats.forEach((s) => {
          if (s.player && s._id.toString() !== seatId) {
            s.player.checkBetFold = false;
          }
        });
      }

      // Update the player and game state with the bet.
      seat.player.chips -= betAmount;
      game.pot += betAmount;
      seat.player.bet += betAmount;
      seat.player.action = action;
      seat.player.checkBetFold = true;

      console.log("[playerBetSocket] Updated bet for seat:", seat);

      await game.save();
      console.log("[playerBetSocket] Game saved after bet update.");

      // Check if all players have acted.
      const allHaveActed = playersHaveActed(game, seatId, action);
      if (allHaveActed) {
        console.log(
          "[playerBetSocket] All players have acted. Proceeding to next stage."
        );
        proceedToNextStage(game);
        await game.save();
        console.log("[playerBetSocket] Proceeded to next stage:", game.stage);
      } else {
        // Set the next player's turn.
        game.currentPlayerTurn = findNextPosition(
          game.currentPlayerTurn,
          game.seats
        );
        console.log(
          "[playerBetSocket] Next player's turn set to:",
          game.currentPlayerTurn
        );
      }

      await game.save();
      console.log("[playerBetSocket] Final game state saved.");

      // Emit a single consolidated event with the updated game.
      console.log(
        "[playerBetSocket] Emitting gameUpdated event with game:",
        game
      );
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error("[playerBetSocket] Error handling player bet:", error);
      socket.emit("playerBetError", { error: "Failed to place bet" });
    }
  });
};

module.exports = playerBetSocket;
