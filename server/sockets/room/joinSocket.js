const Game = require("../../models/games");
const User = require("../../models/users");

const isSeatAvailable = (seats, seatId) => {
  return seats.some(seat => seat._id.toString() === seatId && !seat.player);
}

function joinSocket(socket, io) {
  socket.on('joinGame', async (data) => {
    try {

      const { userId, gameId, seatId, buyIn } = data;

      const game = await Game.findById(gameId);
      if (!game) {
        console.log("Game not found with ID:", gameId);
        return socket.emit("joinGameError", { message: "Game not found!" });
      }

      const user = await User.findById(userId);
      if (!user) {
        console.log("User not found with ID:", userId);
        return socket.emit("joinGameError", { message: "User not found!" });
      }

      if (buyIn < game.min || buyIn > game.max || !buyIn || typeof buyIn !== "number") {
        console.log("Invalid buy-in:", buyIn, "for game limits:", game.min, "-", game.max);
        return socket.emit("joinGameError", { message: `Invalid buy-in. Buy-in should be between ${game.min} and ${game.max}.` });
      }

      if (user.accountBalance < buyIn) {
        console.log("User has insufficient funds. Account balance:", user.accountBalance, "Buy-in:", buyIn);
        return socket.emit("joinGameError", { message: "Insufficient funds!" });
      }

      if (game.seats.some(seat => seat.player && seat.player.user.toString() === userId)) {
        console.log("User is already sitting in a seat for this game");
        return socket.emit("joinGameError", { message: "You are already sitting at a seat in this game!" });
      }

      if (!isSeatAvailable(game.seats, seatId)) {
        console.log("Seat not available or doesn't exist with ID:", seatId);
        return socket.emit("joinGameError", { message: "Seat not available or does not exist!" });
      }

      user.accountBalance -= buyIn;
      game.playerCount += 1;
      const player = {
        user: user._id,
        username: user.username,
        chips: buyIn,
        handCards: [],
        bet: 0
      };
      game.seats.find(seat => seat._id.toString() === seatId).player = player;

      console.log("Saving game and user after modifications...");
      await game.save();
      await user.save();

      io.emit("playerJoin", game); 

      socket.emit("gameJoined", { message: "Successfully joined the game!", game });

    } catch (err) {
      console.error("Error occurred:", err);
      socket.emit("joinGameError", { message: err.message });
    }
  });
}

module.exports = joinSocket;
