const Game = require("../../models/games");
var Hand = require("pokersolver").Hand;

function resetActionNone(game) {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
}

function winningSocket(socket, io) {
  socket.on("get_winner", async (data) => {
    const { gameId } = data;

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return socket.emit("error", { message: "Game not found!" });
      }

      if (game.pot <= 0 || game.stage !== "showdown" || game.communityCards.length !== 5) {
        return socket.emit("winnerError", { message: "Not time to determine winner" });
      }

      const playersActive = game.seats.filter(
        (seat) => seat.player && seat.player.handCards.length > 0
      );
      if (playersActive.length <= 1) {
        return socket.emit("winnerError", { message: "Not enough active players to determine a winner" });
      }

      const communityCards = game.communityCards.map(
        (card) => card[0].toUpperCase() + card.slice(1).toLowerCase()
      );
      console.log("Community Cards:", communityCards);


      const playersData = game.seats
        .filter((seat) => seat.player && seat.player.handCards.length)
        .map((seat) => {
          return {
            seatId: seat._id.toString(),
            handCards: seat.player.handCards.map(
              (card) => card[0].toUpperCase() + card.slice(1).toLowerCase()
            ),
            playerData: seat.player,
          };
        });

      console.log("Players Data:", playersData);

      const hands = playersData.map((player, index) => {
        const fullHand = [...communityCards, ...player.handCards];


        const handSolved = Hand.solve(fullHand);


        return {
          seatId: player.seatId,
          playerData: player.playerData,
          hand: handSolved,
        };
      });


      const winningHands = Hand.winners(hands.map((h) => h.hand));
      console.log("Winning Hands:", winningHands);

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

      console.log("Final Winner Data before assignment:", winnerData);

      try {
        game.winnerData = winnerData;


        game.winnerData.forEach(winner => {
          const winningSeat = game.seats.find(seat => seat._id.toString() === winner.seatId);
          if (winningSeat && winningSeat.player) {
            winningSeat.player.chips += winner.potAmount;
          }
        });

 
        game.seats.forEach(seat => {
          if (seat.player) {
            seat.player.handCards = [];
          }
        });

        game.pot = 0;
        game.gameEnd = true;
        game.gameRunning = false;
        game.currentDeck = [];
        game.highestBet = 0;
        game.betPlaced = false;
        game.stage = "end";

        await game.save();

 
        io.emit("winner_received", game);
      } catch (saveError) {
        console.error("Error saving game document:", saveError);
        socket.emit("winnerError", { message: "Failed to save game state." });
        return;
      }

      
      resetActionNone(game);
    } catch (error) {
      console.error("Error determining winner:", error);
      socket.emit("winnerError", { message: "An error occurred while determining the winner." });
    }
  });
}

module.exports = { winningSocket };
