const Game = require("../../models/games");

function allGamesSocket(socket) {
  socket.on("getGames", async () => {

    try {
      const games = await Game.find({});
      socket.emit("gamesData", games);
    } catch (error) {
      console.error(`Error fetching games for socket: ${socket.id}. Error: ${error}`);
      socket.emit("gamesError", error.toString());
    }
  });
};

function gameSocket (socket) {
  socket.on("getGame", async (gameId) => {
  
    try {
      const game = await Game.findById(gameId);
      if (game) {
        console.log(`Sending 'gameData' to socket: ${socket.id} for game: ${gameId}.`);
        socket.emit("gameData", game);
      } else {
        throw new Error(`Game with id: ${gameId} not found`);
      }
    } catch (error) {
      console.error(`Error fetching game with id: ${gameId} for socket: ${socket.id}. Error: ${error}`);
      socket.emit("gameError", error.toString());
    }
  });
};

module.exports = {allGamesSocket, gameSocket};