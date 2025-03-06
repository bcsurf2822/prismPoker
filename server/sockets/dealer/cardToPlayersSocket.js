const Game = require("../../models/games");
const dealLocks = {};

// Combined socket function for dealing cards
const dealCardsSocket = (io, socket) => {
  socket.on("dealCardsToPlayers", async ({ gameId }) => {
    console.log(`Socket event 'dealCardsToPlayers' received for game: ${gameId}`);
    
    // Check if the game is already being dealt to
    if (dealLocks[gameId]) {
      console.log(`Deal lock already exists for game: ${gameId}, returning game without dealing cards`);
      const game = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      io.emit("gameUpdated", game);
      return;
    }
    
    console.log(`Setting deal lock for game: ${gameId}`);
    dealLocks[gameId] = true;
    
    try {
      console.log(`Finding game with ID: ${gameId}`);
      let game = await Game.findById(gameId);
      
      if (!game) {
        console.error(`Game with ID: ${gameId} not found!`);
        throw new Error(`Game with ID: ${gameId} not found!`);
      }
      
      console.log(`Game found: ${game.name}, current stage: ${game.stage}`);
      const seatsWithPlayers = game.seats.filter((seat) => seat.player !== null);
      const numberOfPlayers = seatsWithPlayers.length;
      console.log(`Number of players found: ${numberOfPlayers}`);
      console.log(`Current deck size: ${game.currentDeck.length}`);
      
      console.log(`Clearing player hands...`);
      game.seats.forEach((seat, index) => {
        if (seat.player) {
          console.log(`Clearing hand for seat ${index}, player: ${seat.player.user}`);
          seat.player.handCards = [];
          seat.player.checkBetFold = false;
        }
      });
      
      console.log(`Dealer position: ${game.dealerPosition}, Big blind position: ${game.bigBlindPosition}`);
      
      // Deal 2 rounds of cards
      for (let round = 0; round < 2; round++) {
        console.log(`Starting dealing round ${round + 1}`);
        
        for (let j = 0; j < numberOfPlayers; j++) {
          const playerIndex = (game.bigBlindPosition + 1 + j) % numberOfPlayers;
          const seat = seatsWithPlayers[playerIndex];
          
          if (!seat) {
            console.error(`dealCardsToPlayers: No seat found for playerIndex ${playerIndex}`);
            continue;
          }
          
          console.log(`Dealing card to player at seat ${seat.seatNumber}, index ${playerIndex}`);
          
          const card = game.currentDeck.shift();
          if (!card) {
            console.error(`dealCardsToPlayers: No more cards available in the currentDeck!`);
            console.log(`Current deck state: ${JSON.stringify(game.currentDeck)}`);
            throw new Error("Not enough cards to deal!");
          }
          
          console.log(`Dealt card: ${card.code} to seat ${seat.seatNumber}`);
          seat.player.handCards.push(card);
        }
      }
      
      console.log(`Saving game after dealing cards...`);
      await game.save();
      console.log(`Cards successfully dealt to all players in game: ${gameId}`);
      
      console.log(`Populating user data for game: ${gameId}`);
      game = await Game.findById(gameId).populate(
        "seats.player.user",
        "username"
      );
      
      console.log(`Emitting 'gameUpdated' event to all clients`);
      io.emit("gameUpdated", game);
      
    } catch (error) {
      console.error(
        `Error dealing cards to players for game ${gameId}:`,
        error
      );
      console.error(error.stack);
      socket.emit("gameError", error.message);
    } finally {
      console.log(`Releasing deal lock for game: ${gameId}`);
      delete dealLocks[gameId];
    }
  });
};

module.exports = dealCardsSocket;