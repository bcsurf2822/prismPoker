const Game = require("../../models/games");
const { resetForNewRound } = require("../../utils/gameHelpers");
var Hand = require("pokersolver").Hand;

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}

const winningSocket = (io, socket) => {
  socket.on("getWinner", async (data) => {
    const { gameId } = data;
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      // Surrender logic: if game.stage === "surrender"
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
        console.log(
          "[winningSocket] Surrender logic complete. Emitting gameUpdated:",
          populatedGame
        );
        return io.emit("gameUpdated", populatedGame);
      }

      // Normal showdown logic:
      if (
        game.pot <= 0 ||
        game.stage !== "showdown" ||
        game.communityCards.length !== 5
      ) {
        return socket.emit("winnerError", {
          message: "Not time to determine winner",
        });
      }

      const communityCards = game.communityCards.map(
        (card) => card.code[0].toUpperCase() + card.code.slice(1).toLowerCase()
      );
      console.log("[winningSocket] Community Cards:", communityCards);

      const playersData = game.seats
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

      console.log("[winningSocket] Players Data:", playersData);

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
      console.log("[winningSocket] Winning Hands:", winningHands);

      const winnerData = winningHands.map((winner) => {
        const matchingSeat = hands.find(
          (h) => h.hand.toString() === winner.toString()
        );
        return {
          seatId: matchingSeat?.seatId,
          user: matchingSeat?.playerData.username,
          handName: winner.name,
          potAmount: game.pot / winningHands.length,
        };
      });

      console.log(
        "[winningSocket] Final Winner Data before assignment:",
        winnerData
      );

      try {
        game.winnerData = winnerData;

        game.winnerData.forEach((winner) => {
          const winningSeat = game.seats.find(
            (seat) => seat._id.toString() === winner.seatId
          );
          if (winningSeat && winningSeat.player) {
            winningSeat.player.chips += winner.potAmount;
          }
        });

        game.seats.forEach((seat) => {
          if (seat.player) {
            seat.player.handCards = [];
          }
        });

        resetForNewRound(game);

        await game.save();
        console.log(
          "[winningSocket] Game saved successfully after determining winner."
        );
        const updatedGame = await Game.findById(gameId).populate(
          "seats.player.user",
          "username"
        );
        io.emit("gameUpdated", updatedGame);
      } catch (saveError) {
        console.error("Error saving game document:", saveError);
        socket.emit("winnerError", { message: "Failed to save game state." });
        return;
      }

      resetActionNone(game);
    } catch (error) {
      console.error("Error determining winner:", error);
      socket.emit("winnerError", {
        message: "An error occurred while determining the winner.",
      });
    }
  });
};

module.exports = winningSocket;
