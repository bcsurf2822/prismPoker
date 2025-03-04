const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function toDecimal(value) {
  return parseFloat(value.toFixed(2));
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountBalance: {
    type: Number,
    default: 0,
    set: toDecimal,
  },
  bankBalance: {
    type: Number,
    default: 10000,
    set: toDecimal,
  },
  avatar: {
    type: String,
    default: "http://localhost:4000/defaultUser.png",
  },
  activeGames: [{
    type: Schema.Types.ObjectId,
    ref: "Game",
  }],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
