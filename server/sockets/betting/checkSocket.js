const Game = require("../../models/games");

function playersHaveActed(game, currentSeatId, currentAction) {
  if (currentAction === "raise") {
    return game.seats.every((seat) => {
      return (
        !seat.player ||
        seat._id.toString() === currentSeatId ||
        seat.player.action === "fold" ||
        seat.player.action === "all-in" ||
        (seat.player.bet >= game.highestBet && seat.player.checkBetFold)
      );
    });
  } else {
    return game.seats.every((seat) => {
      return (
        !seat.player ||
        seat._id.toString() === currentSeatId ||
        seat.player.checkBetFold
      );
    });
  }
}

function resetCheckBetFold(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.checkBetFold = false;
    }
  });
}

function playersWithCards(game) {
  return game.seats.filter(
    (seat) => seat.player && seat.player.handCards.length
  ).length;
}

const findNextPosition = (startPosition, seats) => {
  let seatCount = seats.length;
  let nextPosition = (startPosition + 1) % seatCount;
  while (!seats[nextPosition].player) {
    nextPosition = (nextPosition + 1) % seatCount;
  }
  return nextPosition;
};

function proceedToNextStage(game) {
  if (game.stage !== "showdown") {
    if (playersWithCards(game) > 2) {
      game.stage = "showdown";
    } else {
      switch (game.stage) {
        case "preflop":
          game.stage = "flop";
          break;
        case "flop":
          game.stage = "turn";
          break;
        case "turn":
          game.stage = "river";
          break;
        case "river":
          game.stage = "showdown";
          break;
      }
    }
    if (game.stage !== "showdown") {
      resetCheckBetFold(game);
    }
  }

  game.highestBet = 0;
}


const checkSocket = (socket, io) => {
  socket.on("check", async (data) => {
    console.log("[checkSocket] Received check event with data:", data);
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

      // If all players have acted, proceed to the next stage (if applicable)
      if (playersHaveActed(game)) {
        console.log("[checkSocket] All players have acted. Proceeding to next stage.");
        proceedToNextStage(game);
        await game.save();
      }

      // Set the next player's turn. Loop until you find a valid seat.
      game.currentPlayerTurn = findNextActivePlayer(game, game.currentPlayerTurn);
      console.log("[checkSocket] Next active player position determined:", game.currentPlayerTurn);

      await game.save();
      console.log("[checkSocket] Game saved successfully after check.");

      // Emit one consolidated event to update all clients.
      console.log("[checkSocket] Emitting gameUpdated with game:", game);
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error("[checkSocket] Error handling check:", error);
      socket.emit("checkError", { error: "Failed to handle the check" });
    }
  });
};

module.exports = checkSocket;