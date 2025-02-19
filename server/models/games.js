const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

function toDecimal(value) {
  return parseFloat(value.toFixed(2));
}

const CardSchema = new Schema({
  value: String,
  suit: String,
  code: String,
});

const PlayerSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  chips: { type: Number, required: true, set: toDecimal },
  handCards: {
    type: [CardSchema],
    default: [],
  },
  bet: { type: Number, required: true, set: toDecimal },
  action: {
    type: String,
    enum: ["check", "call", "bet", "all-in", "fold", "raise", "none"],
    default: "none",
  },
  checkBetFold: {
    type: Boolean,
    default: false,
  },
  sitOut: {
    type: Boolean,
    default: false,
  },
});

const SeatSchema = new Schema({
  seatNumber: { type: Number, required: true },
  player: {
    type: PlayerSchema,
    default: null,
  },
});

const GameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
  blinds: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  handsHr: {
    type: Number,
    required: true,
  },
  playerCount: {
    type: Number,
    default: 0,
  },
  pot: {
    type: Number,
    default: 0,
    set: toDecimal,
  },
  betPlaced: {
    type: Boolean,
    default: false,
  },
  highestBet: {
    type: Number,
    default: 0,
    set: toDecimal,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  dealerPosition: {
    type: Number,
    default: -1,
  },
  smallBlindPosition: {
    type: Number,
    default: -1,
  },
  bigBlindPosition: {
    type: Number,
    default: -1,
  },
  currentPlayerTurn: {
    type: Number,
    default: -1,
  },
  stage: {
    type: String,
    enum: [
      "preflop",
      "flop",
      "turn",
      "river",
      "surrender",
      "defaultShowdown",
      "showdown",
      "end",
    ],
    default: "preflop",
  },
  gameRunning: {
    type: Boolean,
    default: false,
  },
  currentDeck: {
    type: [CardSchema],
    default: [],
  },
  communityCards: {
    type: [CardSchema],
    default: [],
  },
  dealtCards: {
    type: [String],
    default: [],
  },
  winnerData: {
    type: [
      {
        seatId: String,
        user: String,
        handName: String,
        potAmount: Number,
        message: String,
      },
    ],
    default: [],
  },
  seats: {
    type: [SeatSchema],
    default: Array.from({ length: 6 }, (_, i) => ({
      seatNumber: i,
      player: null,
    })),
  },
});

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
