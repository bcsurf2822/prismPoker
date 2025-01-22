const Game = require("../../models/games");

function roomSocket(socket) {

  socket.on("getGameById", async (gameId) => {
    try {
      const game = await Game.findById(gameId);
      if (game) {
        socket.emit("gameData", game);
      } else {
        socket.emit("gameError", "Game not found");
      }
    } catch (error) {
      console.error(error);
      socket.emit("gameError", error.toString());
    }
  });
}

module.exports = roomSocket;