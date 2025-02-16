const resetGame = (game) => {
  game.pot = 0;
  game.highestBet = 0;
  game.currentDeck = [];
  game.communityCards = [];
  game.dealtCards = [];
  game.winnerData = [];
  game.stage = "preflop";
  game.gameRunning = false;
  game.gameEnd = false;
  game.dealerPosition = -1;
  game.smallBlindPosition = -1;
  game.bigBlindPosition = -1;
  game.currentPlayerTurn = -1;
};

module.exports = resetGame;