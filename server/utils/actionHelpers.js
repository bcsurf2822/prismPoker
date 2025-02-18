const playersHaveActed = (game, currentSeatId, currentAction) => {
  console.log(
    "[playersHaveActed] Called with currentSeatId:",
    currentSeatId,
    "currentAction:",
    currentAction
  );

  if (currentAction === "raise") {
    const result = game.seats.every((seat, index) => {
      const seatId = seat._id ? seat._id.toString() : "undefined";
      const condition =
        !seat.player ||
        seatId === currentSeatId ||
        seat.player.action === "fold" ||
        seat.player.action === "all-in" ||
        (seat.player.bet >= game.highestBet && seat.player.checkBetFold);
      console.log(
        `[playersHaveActed] Seat ${index} (ID: ${seatId}) condition:`,
        condition,
        "Player:",
        seat.player
      );
      return condition;
    });
    console.log("[playersHaveActed] Returning result:", result);
    return result;
  } else {
    const result = game.seats.every((seat, index) => {
      const seatId = seat._id ? seat._id.toString() : "undefined";
      const condition =
        !seat.player || seatId === currentSeatId || seat.player.checkBetFold;
      console.log(
        `[playersHaveActed] Seat ${index} (ID: ${seatId}) condition:`,
        condition,
        "Player:",
        seat.player
      );
      return condition;
    });
    console.log("[playersHaveActed] Returning result:", result);
    return result;
  }
};

const resetPlayerActions = (game) => {
  game.seats.forEach((seat) => {
    if (seat.player) {
      seat.player.bet = 0;
      seat.player.action = "none";
      seat.player.checkBetFold = false;
    }
  });
};

const playersWithCards = (game) => {
  return game.seats.filter(
    (seat) => seat.player && seat.player.handCards.length
  ).length;
};

const findNextPosition = (startPosition, seats) => {
  const seatCount = seats.length;

  let nextPosition = (startPosition + 1) % seatCount;
  let iterations = 0;

  while (!seats[nextPosition].player) {
    nextPosition = (nextPosition + 1) % seatCount;
    iterations++;
    if (iterations > seatCount) {
      console.error(
        "[findNextPosition] Could not find a valid seat after",
        iterations,
        "iterations."
      );
      break;
    }
  }
  return nextPosition;
};

const proceedToNextStage = (game) => {
  if (game.stage !== "showdown") {
    if (playersWithCards(game) > 2) {
      game.stage = "showdown";
    } else {
      switch (game.stage) {
        case "preflop":
          game.stage = "flop";
          break;
        case "flop":
          game.stage = "turn";
          break;
        case "turn":
          game.stage = "river";
          break;
        case "river":
          game.stage = "showdown";
          break;
      }
    }
    resetPlayerActions(game);
  }
  game.highestBet = 0;
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
  playersHaveActed,
  resetPlayerActions,
  playersWithCards,
  findNextPosition,
  proceedToNextStage,
  findNextActivePlayer,
};
