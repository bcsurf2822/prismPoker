const router = require("express").Router();
const Game = require("../models/games");

router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate(
      "seats.player.user",
      "username"
    );

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
