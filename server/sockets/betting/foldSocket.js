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

      // Process the fold: clear the player's cards, update action, mark as checked
      seat.player.handCards = [];
      seat.player.action = action;
      seat.player.checkBetFold = true;
      console.log("[foldSocket] Updated player state after fold:", seat.player);

      await game.save();
      console.log("[foldSocket] Game saved after fold action.");

      // Check if all players have acted; if so, proceed to next stage
      if (playersHaveActed(game)) {
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

      // Emit one consolidated event with the updated game state
      console.log("[foldSocket] Emitting gameUpdated event with game:", game);
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error("[foldSocket] Error handling fold:", error);
      socket.emit("foldError", { error: "Failed to handle the fold" });
    }
  });
};

module.exports = foldSocket;