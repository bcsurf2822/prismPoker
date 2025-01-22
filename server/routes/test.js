const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully!",
    timestamp: new Date(),
  });
});

module.exports = router;