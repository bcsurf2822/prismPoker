const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

router.post("/", async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } //
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
