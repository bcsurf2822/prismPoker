export const testGame = {
  _id: "testGameId123",
  name: "Test Table",
  gameType: "Texas Hold'em",
  blinds: "0.05/0.10",
  min: 5,
  max: 10,
  playerCount: 2,
  pot: 15,
  highestBet: 5,
  dealerPosition: 0,
  smallBlindPosition: 1,
  bigBlindPosition: 1,
  currentPlayerTurn: 0,
  stage: "preflop",
  gameRunning: false,
  currentDeck: [],
  communityCards: [],
  dealtCards: [],
  winnerData: [],
  seats: [
    {
      _id: "seat0",
      seatNumber: 0,
      player: {
        user: { _id: "user1", username: "Alice" },
        chips: 50,
        bet: 0,
        action: "none",
        checkBetFold: false,
        handCards: [
          { value: "A", suit: "Spades", code: "AS", _id: "card1" },
          { value: "K", suit: "Hearts", code: "KH", _id: "card2" },
        ],
      },
    },
    {
      _id: "seat1",
      seatNumber: 1,
      player: {
        user: { _id: "user2", username: "Bob" },
        chips: 40,
        bet: 0,
        action: "none",
        checkBetFold: false,
        handCards: [
          { value: "10", suit: "Clubs", code: "10C", _id: "card3" },
          { value: "9", suit: "Diamonds", code: "9D", _id: "card4" },
        ],
      },
    },
    // Remaining seats empty
    { _id: "seat2", seatNumber: 2, player: null },
    { _id: "seat3", seatNumber: 3, player: null },
    { _id: "seat4", seatNumber: 4, player: null },
    { _id: "seat5", seatNumber: 5, player: null },
  ],
};


export const testCards3 = [
  { code: "3S", value: "3", suit: "Spades" },
  { code: "2C", value: "2", suit: "Clubs" },
  { code: "AD", value: "A", suit: "Diamonds" },
];

export const testCards4 = [
  { code: "3S", value: "3", suit: "Spades" },
  { code: "2C", value: "2", suit: "Clubs" },
  { code: "AD", value: "A", suit: "Diamonds" },
  { code: "KH", value: "K", suit: "Hearts" },
];

export const testCards5 = [
  { code: "3S", value: "3", suit: "Spades" },
  { code: "2C", value: "2", suit: "Clubs" },
  { code: "AD", value: "A", suit: "Diamonds" },
  { code: "KH", value: "K", suit: "Hearts" },
  { code: "QC", value: "Q", suit: "Clubs" },
];
