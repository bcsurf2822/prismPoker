const Game = require("../../models/gamesSchema");

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

//Bet and All in
function playerBetSocket(socket, io) {
  socket.on("player_bet", async (data) => {
    const { gameId, seatId, bet, action } = data;
    let betAmount = Number(bet);

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        console.error("Game not found!");
        return socket.emit("error", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);
      if (!seat || !seat.player) {
        console.error("No Player at this Seat");
        return socket.emit("error", { message: "No Player at this Seat" });
      }

      if (
        !betAmount ||
        isNaN(betAmount) ||
        (seat.player.chips < betAmount && action !== "all-in")
      ) {
        console.error("Invalid Bet or Not Enough Chips");
        return socket.emit("error", {
          message: "Invalid Bet or Not Enough Chips",
        });
      }

      // Handling bet, raise, and all-in actions
      if (action === "all-in") {
        betAmount = bet;
      }

      if (action === "bet" || action === "raise") {
        if (action === "raise" && betAmount <= game.highestBet) {
          console.error("Raise must be higher than the current highest bet");
          return socket.emit("error", {
            message: "Raise must be higher than the current highest bet",
          });
        }

        console.log(`Handling ${action} action, betAmount: ${betAmount}`);
        game.highestBet = betAmount;
        game.seats.forEach((s) => {
          if (s.player && s._id.toString() !== seatId) {
            s.player.checkBetFold = false;
          }
        });
      }

      // Update player and game state with the bet amount
      seat.player.chips -= betAmount;
      game.pot += betAmount;
      seat.player.bet += betAmount;
      seat.player.action = action;
      seat.player.checkBetFold = true;

      await game.save();

      // Check if all players have acted to decide whether to move to the next stage
      const allHaveActed = playersHaveActed(game, seatId, action);

      if (allHaveActed) {
        proceedToNextStage(game);
        await game.save();
        console.log(`Proceeding to next stage: ${game.stage}`);
      } else {
        game.currentPlayerTurn = findNextPosition(
          game.currentPlayerTurn,
          game.seats
        );
        console.log(`Next player's turn: ${game.currentPlayerTurn}`);
      }

      await game.save();

      // Emit events for the next player and the action taken
      io.emit("next_current_player", game);
      io.emit("player_bet_placed", game);
    } catch (error) {
      console.error("Failed to place bet", error);
      socket.emit("playerBetError", { error: "Failed to place bet" });
    }
  });
}

//call socket
function callSocket(socket, io) {
  socket.on("player_call", async (data) => {
    const { gameId, seatId, action, bet } = data;

    console.log("Received player_call data:", data);

    try {
      const game = await Game.findById(gameId);

      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);

      if (!seat) {
        return socket.emit("error", { message: "Seat not Found!" });
      }

      if (!seat.player) {
        return socket.emit("error", { message: "No Player at this Seat" });
      }

      const callAmount = bet;

      if (seat.player.chips < callAmount) {
        return socket.emit("error", { message: "Not Enough Chips to Call" });
      }

      console.log(
        `Before calling - pot: ${game.pot}, callAmount: ${callAmount}, playerChips: ${seat.player.chips}`
      );

      seat.player.chips -= callAmount;
      game.pot += callAmount;

      console.log(
        `After calling - pot: ${game.pot}, playerChips: ${seat.player.chips}`
      );

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

      io.emit("next_current_player", game);

      io.emit("player_called_bet", game);
    } catch (error) {
      console.error(error);
      socket.emit("playerCallError", { error: "Failed to call bet" });
    }
  });
}

function checkSocket(socket, io) {
  socket.on("check", async (data) => {
    const { gameId, seatId, action } = data;
    console.log("Received check event on server with data:", data);
    try {
      const game = await Game.findById(gameId);

      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);

      if (!seat) {
        return socket.emit("error", { message: "Seat not found!" });
      }

      if (!seat.player) {
        return socket.emit("error", { message: "No Player At Seat" });
      }

      seat.player.action = action;
      seat.player.checkBetFold = true;

      await game.save();

      if (playersHaveActed(game)) {
        proceedToNextStage(game);
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

      console.log("Emitting next_current_player with game:", game);
      io.emit("next_current_player", game);

      console.log("About to emit player_checked with game:", game);
      io.emit("player_checked", game);
      console.log("Emitted player_checked with game:", game);
    } catch (error) {
      console.error(error);
      socket.emit("checkError", { error: "Failed to handle the check" });
    }
  });
}

function foldSocket(socket, io) {
  socket.on("fold", async (data) => {
    const { gameId, seatId, action } = data;

    try {
      const game = await Game.findById(gameId);

      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      const seat = game.seats.find((s) => s._id.toString() === seatId);

      if (!seat) {
        return socket.emit("error", { message: "Seat not found!" });
      }

      if (!seat.player) {
        return socket.emit("error", { message: "No Player At Seat" });
      }

      seat.player.handCards = [];
      seat.player.action = action;
      seat.player.checkBetFold = true;

      await game.save();

      if (playersHaveActed(game)) {
        proceedToNextStage(game);
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

      io.emit("next_current_player", game);

      io.emit("player_folded", game);
    } catch (error) {
      console.error(error);
      socket.emit("foldError", { error: "Failed to handle the fold" });
    }
  });
}

module.exports = {
  playerBetSocket,
  callSocket,
  checkSocket,
  foldSocket,
};
