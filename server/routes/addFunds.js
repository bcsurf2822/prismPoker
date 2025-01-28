const router = require("express").Router();
const User = require("../models/users");

const {authenticateToken} = require("../middleware/authMiddleware")

router.post("/", authenticateToken, async (req, res) => {
  const { amount } = req.body;

  // Validate the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }

  try {
    const user = await User.findById(req.user.id); // Assuming user ID is available in req.user from the token

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has sufficient funds in the bankBalance
    if (user.bankBalance < amount) {
      return res.status(400).json({ error: "Insufficient bank balance" });
    }

    // Update balances
    user.bankBalance -= amount;
    user.accountBalance += amount;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Funds added successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountBalance: user.accountBalance,
        bankBalance: user.bankBalance,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;