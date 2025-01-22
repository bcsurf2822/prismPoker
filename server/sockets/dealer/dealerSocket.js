const Game = require("../../models/gamesSchema");

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}

function findNextActivePlayer(game, startingPosition) {
  let nextPosition = startingPosition % game.seats.length;
  while (
    game.seats[nextPosition].player == null ||
    game.seats[nextPosition].player.handCards.length === 0
  ) {
    nextPosition = (nextPosition + 1) % game.seats.length;
  }

  return nextPosition;
}

function dealFlopSocket(socket, io) {
  socket.on("deal_flop", async (data) => {
    const { gameId } = data;

    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (game.stage !== "flop" || game.communityCards.length > 0) {
        return socket.emit("dealFlopError", {
          message: "Conditions not met to deal the flop!",
        });
      }

      game.seats.forEach((seat) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      const burnCard = game.currentDeck.splice(0, 1)[0].code;
      game.dealtCards.push(burnCard);

      if (game.currentDeck.length < 3) {
        return socket.emit("dealFlopError", {
          message: "Not enough cards to deal the flop!",
        });
      }

      const flopCards = game.currentDeck.splice(0, 3).map((card) => card.code);
      game.dealtCards.push(...flopCards);
      game.communityCards.push(...flopCards);
      game.highestBet = 0;
      game.betPlaced = false;
      game.currentPlayerTurn = findNextActivePlayer(
        game,
        game.dealerPosition + 1
      );

      await game.save();

      io.emit("flop_dealt", game);
    } catch (error) {
      console.error(error);
      socket.emit("dealFlopError", { error: "Failed to deal the flop" });
    }
  });
}

function dealTurnSocket(socket, io) {
  socket.on("deal_turn", async (data) => {
    const { gameId } = data;

    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (
        game.currentDeck.length < 2 ||
        game.stage !== "turn" ||
        game.communityCards.length > 3
      ) {
        return socket.emit("dealTurnError", {
          message: "Conditions not met to deal the turn!",
        });
      }

      game.seats.forEach((seat) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      const burntCard = game.currentDeck.shift().code;
      game.dealtCards.push(burntCard);

      const turnCard = game.currentDeck.shift().code;
      game.dealtCards.push(turnCard);
      game.communityCards.push(turnCard);
      game.highestBet = 0;
      game.betPlaced = false;
      game.currentPlayerTurn = findNextActivePlayer(
        game,
        game.dealerPosition + 1
      );

      await game.save();

      io.emit("turn_dealt", game);
    } catch (error) {
      console.error(error);
      socket.emit("dealTurnError", { error: "Failed to deal the turn" });
    }
  });
}

function dealRiverSocket(socket, io) {
  socket.on("deal_river", async (data) => {
    const { gameId } = data;

    try {
      const game = await Game.findById(gameId);

      resetActionNone(game);

      if (
        game.currentDeck.length < 2 ||
        game.stage !== "river" ||
        game.communityCards.length > 4
      ) {
        return socket.emit("dealRiverError", {
          message: "Conditions not met to deal the river!",
        });
      }

      game.seats.forEach((seat) => {
        if (seat.player) {
          seat.player.checkBetFold = false;
        }
      });

      const burntCard = game.currentDeck.shift().code;
      game.dealtCards.push(burntCard);

      const riverCard = game.currentDeck.shift().code;
      game.dealtCards.push(riverCard);
      game.communityCards.push(riverCard);
      game.highestBet = 0;
      game.betPlaced = false;
      game.currentPlayerTurn = findNextActivePlayer(
        game,
        game.dealerPosition + 1
      );

      await game.save();

      io.emit("river_dealt", game);
    } catch (error) {
      console.error(error);
      socket.emit("dealRiverError", { error: "Failed to deal the river" });
    }
  });
}

module.exports = {
  dealFlopSocket,
  dealTurnSocket,
  dealRiverSocket,
};
