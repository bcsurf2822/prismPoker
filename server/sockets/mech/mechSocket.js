const Game = require("../../models/games");
const axios = require("axios");

function cardCode(code) {
  return code.replace("0", "10");
}

const findNextPosition = (startPosition, seats) => {
  let seatCount = seats.length;
  let nextPosition = (startPosition + 1) % seatCount;
  while (!seats[nextPosition].player) {
    nextPosition = (nextPosition + 1) % seatCount;
  }
  return nextPosition;
};

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}


function updateCurrentPlayerSocket(socket, io) {
  socket.on("updateCurrentPlayer", async ({ gameId }) => {
    try {
      const game = await Game.findById(gameId);

      if (!game) {
        console.error(`Game with ID: ${gameId} not found!`);
        socket.emit("error", "Game not found!");
        return;
      }

      game.currentPlayerTurn = findNextPosition(
        game.currentPlayerTurn,
        game.seats
      );

      await game.save();


      io.emit("next_current_player", game);
    } catch (error) {
      console.error(`Error updating current player for game ${gameId}:`, error);
      socket.emit("error", error.message);
    }
  });
}

function endGameSocket(socket, io) {
  socket.on("end_game", async ({ gameId }) => {
    try {
      const game = await Game.findById(gameId);

      if (!game) {
        console.error(`Game with ID: ${gameId} not found!`);
        socket.emit("error", "Game not found!");
        return;
      }

      const occupiedSeatsCount = game.seats.filter(seat => seat.player !== null).length;

      resetActionNone(game);

      game.currentDeck = [];
      game.communityCards = [];
      game.dealtCards = [];
      game.winnerData = [];
      game.pot = 0;
      game.highestBet = 0;
      game.stage = "preflop";
      game.gameEnd = true;
      game.gameRunning = false;
      game.betPlaced = false;

      game.seats.forEach((seat) => {
        if (seat.player) {
          seat.player.handCards = [];
          seat.player.checkBetFold = false;
        }
      });

      if (occupiedSeatsCount < 2) {
        game.dealerPosition = -1;
        game.smallBlindPosition = -1;
        game.bigBlindPosition = -1;
        game.currentPlayerTurn = -1;
        console.log("Positions Have Been Reset")
      }

      const response = await axios.get(
        "https://www.deckofcardsapi.com/api/deck/new/draw/?count=52"
      );

      const currentGameCards = response.data.cards.map((card) => ({
        value: card.value,
        suit: card.suit,
        code: cardCode(card.code),
      }));

      game.currentDeck = currentGameCards;

      await game.save();
      io.emit("game_ended", game);

      socket.emit("game_end_success", { message: "Game ended, cards cleared" });
    } catch (error) {
      console.error(error);
      socket.emit("error", "Failed to end the game");
    }
  });
}

module.exports = {
  updateCurrentPlayerSocket,
  endGameSocket,
};
