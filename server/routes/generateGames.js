const router = require("express").Router();
const Game = require("../models/games");

router.post("/", async (req, res) => {
  try {
    const gameStakes = [
      { blinds: { smallBlind: 0.05, bigBlind: 0.1 }, min: 5, max: 10 },
      { blinds: { smallBlind: 0.25, bigBlind: 0.5 }, min: 25, max: 50 },
      { blinds: { smallBlind: 1, bigBlind: 2 }, min: 100, max: 200 },
      { blinds: { smallBlind: 2.5, bigBlind: 5 }, min: 250, max: 500 },
      { blinds: { smallBlind: 5, bigBlind: 10 }, min: 500, max: 1000 },
      { blinds: { smallBlind: 25, bigBlind: 50 }, min: 2500, max: 5000 },
    ];
    
    for (let i = 0; i < gameStakes.length; i++) {
      const game = new Game({
        name: `Game ${i + 1}`,
        gameType: "Texas Hold 'em",
        blinds: gameStakes[i].blinds,
        min: gameStakes[i].min,
        max: gameStakes[i].max,
        handsHr: 0,
        playersInGame: [],
        communityCards: [],
        pot: 0,
      });

      await game.save();
    }

    res.status(200).json({ message: "Games populated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while populating the games" });
  }
});

module.exports = router;
