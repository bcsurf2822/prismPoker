const axios = require("axios");

const cardCode = (code) => code.replace("0", "10");

const fetchNewDeck = async () => {
  const response = await axios.get(
    "https://www.deckofcardsapi.com/api/deck/new/draw/?count=52"
  );
  return response.data.cards.map((card) => ({
    value: card.value,
    suit: card.suit,
    code: cardCode(card.code),
  }));
};

module.exports = fetchNewDeck;
