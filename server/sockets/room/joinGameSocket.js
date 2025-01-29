const User = require("../../models/users");
const Game = require("../../models/games")


const handlePlayerJoin = (io, socket) => {
  socket.on("playerJoin", async ({ gameId, userId, buyIn, seatId }) => {
    try {
      const game = await Game.findById(gameId);
      const user = await User.findById(userId);

      if (!game || !user) {
        return socket.emit("joinError", { message: "Game or User not found" });
      }

      // Check if the player has enough funds
      if (user.accountBalance < buyIn) {
        return socket.emit("joinError", { message: "Insufficient funds" });
      }

      // Find an open seat
      const seat = game.seats.find((seat) => seat.id === seatId);
      if (!seat || seat.player) {
        return socket.emit("joinError", { message: "Seat is already occupied" });
      }

      // Deduct buy-in amount from user's balance
      user.accountBalance -= buyIn;
      await user.save();

      // Add player to the seat
      seat.player = {
        user: user._id,
        chips: buyIn,
        bet: 0,
        action: "none",
      };

      await game.save();

      // Emit update to all clients in the room
      io.to(gameId).emit("gameUpdated", game);
      socket.emit("joinSuccess", { message: "Joined successfully", game });
    } catch (error) {
      console.error("Error joining game:", error);
      socket.emit("joinError", { message: "Server error" });
    }
  });
};

module.exports = handlePlayerJoin;