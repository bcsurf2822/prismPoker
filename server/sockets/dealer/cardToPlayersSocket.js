const Game = require("../../models/games");

const dealLocks = {};

const dealCardsToPlayers = async (gameId) => {
  if (dealLocks[gameId]) {
    return await Game.findById(gameId);
  }
  dealLocks[gameId] = true;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error(`Game with ID: ${gameId} not found!`);
    }

    const seatsWithPlayers = game.seats.filter((seat) => seat.player !== null);
    const numberOfPlayers = seatsWithPlayers.length;

    game.seats.forEach((seat) => {
      if (seat.player) {
        seat.player.handCards = [];
        seat.player.checkBetFold = false;
      }
    });

    for (let round = 0; round < 2; round++) {
      for (let j = 0; j < numberOfPlayers; j++) {
        const playerIndex = (game.bigBlindPosition + 1 + j) % numberOfPlayers;

        const seat = seatsWithPlayers[playerIndex];
        if (!seat) {
          console.error(
            `dealCardsToPlayers: No seat found for playerIndex ${playerIndex}`
          );
          continue;
        }
        const card = game.currentDeck.shift();
        if (!card) {
          console.error(
            `dealCardsToPlayers: No more cards available in the currentDeck!`
          );
          throw new Error("Not enough cards to deal!");
        }
        seat.player.handCards.push(card);
      }
    }

    await game.save();

    return game;
  } finally {
    delete dealLocks[gameId];
  }
};

const dealCardsSocket = (io, socket) => {
  socket.on("dealCardsToPlayers", async ({ gameId }) => {
    try {
      let game = await dealCardsToPlayers(gameId);

      game = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      io.emit("gameUpdated", game);
    } catch (error) {
      console.error(
        `Error dealing cards to players for game ${gameId}:`,
        error
      );
      socket.emit("gameError", error.message);
    }
  });
};

module.exports = dealCardsSocket;
