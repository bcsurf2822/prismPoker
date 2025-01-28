const router = require("express").Router();
const User = require("../models/users");

const {authenticateToken} = require("../middleware/authMiddleware")


router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      accountBalance: user.accountBalance,
      bankBalance: user.bankBalance,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;