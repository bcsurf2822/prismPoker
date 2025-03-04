const User = require("../../models/users");
const Game = require("../../models/games");

const handlePlayerJoin = (io, socket) => {
  socket.on("playerJoin", async ({ gameId, userId, buyIn, seatId }) => {
    try {
      const game = await Game.findById(gameId);
      const user = await User.findById(userId);

      if (!game || !user) {
        return socket.emit("joinError", { message: "Game or User not found" });
      }

      if (user.accountBalance < buyIn) {
        return socket.emit("joinError", { message: "Insufficient funds" });
      }

      const seat = game.seats.find(
        (seat) => seat._id.toString() === seatId.toString()
      );
      if (!seat || seat.player) {
        return socket.emit("joinError", {
          message: "Seat is already occupied",
        });
      }

      user.accountBalance -= buyIn;
      user.activeGames.push(game._id);
      await user.save();

      seat.player = {
        user: user._id,
        chips: buyIn,
        bet: 0,
        action: "none",
      };

      game.playerCount++;

      await game.save();

      const updatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      const updatedUser = await User.findById(userId);

      io.emit("gameUpdated", updatedGame);
      io.emit("userUpdated", updatedUser);
      socket.emit("joinSuccess", {
        game: updatedGame,
      });
    } catch (error) {
      console.error("Error joining game:", error);
      socket.emit("joinError", { message: "Server error" });
    }
  });
};

module.exports = handlePlayerJoin;
