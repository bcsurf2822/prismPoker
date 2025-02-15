export const normalizeGames = (game) => ({
  id: game._id ? game._id.toString() : game.id,
  name: game.name,
  gameType: game.gameType,
  blinds: game.blinds,
  min: game.min,
  max: game.max,
  handsHr: game.handsHr,
  playerCount: game.playerCount,
  pot: game.pot,
  betPlaced: game.betPlaced,
  highestBet: game.highestBet,
  timestamp: game.timestamp,
  dealerPosition: game.dealerPosition,
  smallBlindPosition: game.smallBlindPosition,
  bigBlindPosition: game.bigBlindPosition,
  currentPlayerTurn: game.currentPlayerTurn,
  stage: game.stage,
  gameRunning: game.gameRunning,
  gameEnd: game.gameEnd,
  currentDeck: game.currentDeck || [],
  communityCards: game.communityCards || [],
  dealtCards: game.dealtCards || [],
  winnerData: game.winnerData || [],
  seats: game.seats
    ? game.seats.map((seat) => ({
        // Use seat.seatNumber for the normalized seat identifier.
        _id: seat._id ? seat._id.toString() : seat.seatNumber.toString(),
        seatNumber: seat.seatNumber,
        player: seat.player
          ? {
              user:
                typeof seat.player.user === "object"
                  ? {
                      id: seat.player.user._id
                        ? seat.player.user._id.toString()
                        : seat.player.user,
                      username: seat.player.user.username,
                    }
                  : seat.player.user,
              chips: seat.player.chips,
              bet: seat.player.bet,
              action: seat.player.action,
              checkBetFold: seat.player.checkBetFold,
              handCards: seat.player.handCards || [],
            }
          : null,
      }))
    : [],
});
