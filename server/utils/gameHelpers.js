const resetGame = (game) => {
  game.pot = 0;
  game.highestBet = 0;
  game.currentDeck = [];
  game.communityCards = [];
  game.dealtCards = [];
  game.winnerData = [];
  game.stage = "preflop";
  game.gameRunning = false;
  game.dealerPosition = -1;
  game.smallBlindPosition = -1;
  game.bigBlindPosition = -1;
  game.currentPlayerTurn = -1;
};

const resetForNewRound = (game) => {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.handCards = [];
    }
  });
  game.pot = 0;
  game.gameRunning = false;
  game.currentDeck = [];
  game.dealtCards = [];
  game.communityCards = [];
  game.highestBet = 0;
  game.betPlaced = false;
  game.stage = "end";
};

module.exports = { resetGame, resetForNewRound };
