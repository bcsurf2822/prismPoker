const router = require("express").Router();
const Game = require("../models/games");

router.get("/", async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;