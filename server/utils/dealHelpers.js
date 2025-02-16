const resetActionNone = (game) => {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.action = "none";
    }
  });
};

const findNextActivePlayer = (game, startingPosition) => {
  let nextPosition = startingPosition % game.seats.length;
  while (
    game.seats[nextPosition].player == null ||
    game.seats[nextPosition].player.handCards.length === 0
  ) {
    nextPosition = (nextPosition + 1) % game.seats.length;
  }
  return nextPosition;
};

module.exports = {
  resetActionNone,
  findNextActivePlayer,
};
