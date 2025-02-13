const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).required(),
});

router.post("/", async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("USER: =====", user)

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
