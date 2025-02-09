const User = require("../../models/users");
const Game = require("../../models/games");

const leaveGameSocket = (io, socket) => {
  socket.on("leaveGame", async (data) => {
    try {
      const { gameId, userId } = data;

      const game = await Game.findById(gameId);
      if (!game) {
        return socket.emit("leaveGameError", { message: "Game not found!" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return socket.emit("leaveGameError", { message: "User not found!" });
      }

      const playerSeat = game.seats.find(
        (seat) => seat.player && seat.player.user.toString() === userId
      );
      if (!playerSeat) {
        return socket.emit("leaveGameError", {
          message: "You are not sitting in this game!",
        });
      }

      user.accountBalance += playerSeat.player.chips;
      playerSeat.player = null;
      game.playerCount -= 1;

      await user.save();

      const remainingPlayers = game.seats.filter(
        (seat) => seat.player !== null
      );

      if (remainingPlayers.length === 1) {
        const lastPlayer = remainingPlayers[0].player;
        lastPlayer.chips += game.pot;
        game.pot = 0;
        game.currentDeck = [];
        game.communityCards = [];
        game.dealtCards = [];
        game.winnerData = [];
        game.stage = "preflop"
        game.gameRunning = false
        game.gameEnd = false;
        game.dealerPosition = -1;
        game.smallBlindPosition = -1;
        game.bigBlindPosition = -1;
        game.currentPlayerTurn = -1;

        io.to(gameId).emit("game_ended", game);
      }

      await game.save();
      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user"
      );
      // Comment out for trying to update the State for the game comp
      // io.to(gameId).emit("gameUpdated", updatedGame);

      // socket.emit("gameLeft", {
      //   message: "Successfully left the game!",
      //   game: updatedGame,
      // });

      io.emit("gameUpdated", updatedGame); // Changed from io.to(gameId)
      socket.emit("gameLeft", { game: updatedGame });
    } catch (err) {
      console.error("Error in leaveSocket:", err);
      socket.emit("leaveGameError", { message: err.message });
    }
  });
};

module.exports = leaveGameSocket;
