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


const callSocket = (io, socket) => {
  socket.on("player_call", async (data) => {
    console.log("[callSocket] Received player_call event with data:", data);
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
        return socket.emit("playerCallError", { message: "No Player at this Seat" });
      }
      
      if (seat.player.chips < callAmount) {
        console.error(
          "[callSocket] Not enough chips: Player chips =", 
          seat.player.chips, 
          "callAmount =", 
          callAmount
        );
        return socket.emit("playerCallError", { message: "Not Enough Chips to Call" });
      }
      
      console.log(
        "[callSocket] Before calling - pot:", game.pot, 
        "callAmount:", callAmount, 
        "playerChips:", seat.player.chips
      );
      
      // Deduct the call amount from the player's chips and add it to the pot.
      seat.player.chips -= callAmount;
      game.pot += callAmount;
      
      console.log(
        "[callSocket] After calling - pot:", game.pot, 
        "playerChips:", seat.player.chips
      );
      
      // Update the player's bet and action.
      seat.player.bet += callAmount;
      seat.player.action = action;
      seat.player.checkBetFold = true;
      
      await game.save();
      console.log("[callSocket] Game saved after updating bet.");
      
      // If all players have acted, proceed to the next stage.
      if (playersHaveActed(game, seatId)) {
        console.log("[callSocket] All players have acted. Proceeding to next stage.");
        proceedToNextStage(game);
        await game.save();
        console.log("[callSocket] Game saved after proceeding to next stage:", game.stage);
      } else {
        // Otherwise, determine the next player's turn.
        game.currentPlayerTurn = findNextPosition(game.currentPlayerTurn, game.seats);
        while (
          !game.seats[game.currentPlayerTurn].player ||
          game.seats[game.currentPlayerTurn].player.handCards.length === 0
        ) {
          game.currentPlayerTurn = findNextPosition(game.currentPlayerTurn, game.seats);
        }
      }
      
      await game.save();
      console.log("[callSocket] Final game state saved.");
      
      // Consolidate and emit one event with the updated game.
      console.log("[callSocket] Emitting gameUpdated event with game:", game);
      io.emit("gameUpdated", game);
    } catch (error) {
      console.error("[callSocket] Error handling player call:", error);
      socket.emit("playerCallError", { error: "Failed to call bet" });
    }
  });
};

module.exports = callSocket;
