const router = require("express").Router();
const Game = require("../models/gamesSchema");

router.post("/createHoldem", async (req, res) => {
  try {
    const gameStakes = [
      { blinds: "0.05/0.10", min: 5, max: 10 },
      { blinds: "0.25/0.50", min: 25, max: 50 },
      { blinds: "1/2", min: 100, max: 200 },
      { blinds: "2.5/5", min: 250, max: 500 },
      { blinds: "5/10", min: 500, max: 1000 },
      { blinds: "25/50", min: 2500, max: 5000 },
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
