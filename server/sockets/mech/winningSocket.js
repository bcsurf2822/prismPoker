const Game = require("../../models/games");
const { resetForNewRound } = require("../../utils/gameHelpers");
var Hand = require("pokersolver").Hand;

const winnerLocks = {};

const winningSocket = (io, socket) => {
  socket.on("getWinner", async (data) => {
    const { gameId } = data;

    if (winnerLocks[gameId]) {
      return;
    }
    winnerLocks[gameId] = true;

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      // Surrender logic
      if (game.stage === "surrender") {
        const populatedGame = await Game.findById(gameId).populate(
          "seats.player.user",
          "username"
        );
        const activeSeats = populatedGame.seats.filter(
          (seat) => seat.player && seat.player.handCards.length > 0
        );
        if (activeSeats.length !== 1) {
          return socket.emit("winnerError", {
            message: "Unexpected number of active players for surrender",
          });
        }
        const lastActive = activeSeats[0];
        const potAmount = populatedGame.pot;
        const username = lastActive.player.user.username;
        const message = `${username} wins $${potAmount} by surrender`;
        lastActive.player.chips += potAmount;

        populatedGame.winnerData = [
          {
            seatId: lastActive._id.toString(),
            user: username,
            handName: "Surrender",
            potAmount: potAmount,
            message: message,
          },
        ];

        resetForNewRound(populatedGame);

        await populatedGame.save();

        return io.emit("gameUpdated", populatedGame);
      }

      // Showdown logic:
      if (
        game.pot <= 0 ||
        game.stage !== "showdown" ||
        game.communityCards.length !== 5
      ) {
        return socket.emit("winnerError", {
          message: "Not time to determine winner",
        });
      }

      const populatedGame = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );

      const communityCards = populatedGame.communityCards.map(
        (card) => card.code[0].toUpperCase() + card.code.slice(1).toLowerCase()
      );

      const playersData = populatedGame.seats
        .filter((seat) => seat.player && seat.player.handCards.length)
        .map((seat) => {
          return {
            seatId: seat._id.toString(),
            handCards: seat.player.handCards.map(
              (card) =>
                card.code[0].toUpperCase() + card.code.slice(1).toLowerCase()
            ),
            playerData: seat.player,
          };
        });

      const hands = playersData.map((player) => {
        const fullHand = [...communityCards, ...player.handCards];
        const handSolved = Hand.solve(fullHand);
        return {
          seatId: player.seatId,
          playerData: player.playerData,
          hand: handSolved,
        };
      });

      const winningHands = Hand.winners(hands.map((h) => h.hand));

      const winnerData = winningHands.map((winner) => {
        const matchingSeat = hands.find(
          (h) => h.hand.toString() === winner.toString()
        );
        const potShare = populatedGame.pot / winningHands.length;
        return {
          seatId: matchingSeat?.seatId,
          user: matchingSeat?.playerData.user.username,
          handName: winner.name,
          potAmount: potShare,
          message: `${matchingSeat?.playerData.user.username} wins $${potShare} with ${winner.name}`,
        };
      });

      try {
        populatedGame.winnerData = winnerData;

        populatedGame.winnerData.forEach((winner) => {
          const winningSeat = populatedGame.seats.find(
            (seat) => seat._id.toString() === winner.seatId
          );
          if (winningSeat && winningSeat.player) {
            winningSeat.player.chips += winner.potAmount;
          }
        });

        populatedGame.seats.forEach((seat) => {
          if (seat.player) {
            seat.player.handCards = [];
          }
        });

        resetForNewRound(populatedGame);

        await populatedGame.save();

        io.emit("gameUpdated", populatedGame);
      } catch (saveError) {
        console.error("Error saving game document:", saveError);
        socket.emit("winnerError", { message: "Failed to save game state." });
        return;
      }
    } catch (error) {
      console.error("Error determining winner:", error);
      socket.emit("winnerError", {
        message: "An error occurred while determining the winner.",
      });
    } finally {
      delete winnerLocks[gameId];
    }
  });
};

module.exports = winningSocket;
