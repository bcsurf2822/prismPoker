import React, { useState } from "react";
import Table from "./Table";
import Seat from "./Seat";
import ChatBetSection from "./ChatBetSection";
import { testGame, testCards3 } from "../../data/testData";

const Room = () => {
  // Create a modified version of the test game to show community cards and player cards
  const initialGame = {
    ...testGame,
    communityCards: testCards3, // Use the test cards from your data
    stage: 'flop', // Set the game stage to 'flop' to show 3 community cards
    seats: testGame.seats.map((seat, index) => {
      // Make Alice and Bob's cards visible to demonstrate the card rendering
      if (index === 0 || index === 1) {
        return {
          ...seat,
          player: {
            ...seat.player,
            // The cards are already defined in the testGame
          }
        };
      }
      return seat;
    })
  };

  const [currentGame, setCurrentGame] = useState(initialGame);
  
  // Define styling for each seat position (0-indexed to match testGame seats)
  const seatStyling = [
    { seatPosition: 0, position: 'top-[-1.5%] left-[35%] -translate-x-1/2' },
    { seatPosition: 1, position: 'top-[-1.5%] left-[65%] -translate-x-1/2' },
    { seatPosition: 2, position: 'right-[-3%] top-1/2 -translate-y-1/2', extraClasses: 'mr-[5%] sm:mr-[3%]' },
    { seatPosition: 3, position: 'bottom-[-1.5%] left-[65%] -translate-x-1/2' },
    { seatPosition: 4, position: 'bottom-[-1.5%] left-[35%] -translate-x-1/2' },
    { seatPosition: 5, position: 'left-[-3%] top-1/2 -translate-y-1/2', extraClasses: 'ml-[5%] sm:ml-[3%]' },
  ];

  // Handle a player joining a seat
  const handleJoinGame = (seatId, buyInAmount) => {
    console.log(`Player joined seat ${seatId} with $${buyInAmount}`);
    // In a real implementation, you would update the player in the game state
    // This is just a stub for demonstration
  };

  // Handle a player leaving the game
  const handleLeaveGame = () => {
    console.log("Player left the game");
    // In a real implementation, you would remove the player from the game state
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top section - 5vh - Title and Exit Button */}
      <div className="h-[5vh] min-h-[40px] bg-gray-800 flex justify-between items-center px-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-bold">
          {currentGame.name}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm">
            <span className="text-gray-400">Blinds:</span> {currentGame.blinds}
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            onClick={handleLeaveGame}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Middle section - 80vh - Table and seats */}
      <div className="h-[80vh] flex-1 relative flex items-center justify-center p-2 overflow-hidden">
        <Table 
          communityCards={currentGame.communityCards} 
          pot={currentGame.pot}
        />
        
        {/* Seats positioned relative to the container */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full max-w-5xl mx-auto">
            <div className="relative w-full aspect-[1.7/1] mx-auto">
              {seatStyling.map(style => {
                const seat = currentGame.seats[style.seatPosition];
                
                return (
                  <Seat 
                    key={style.seatPosition}
                    seat={seat}
                    position={style.position}
                    extraClasses={style.extraClasses}
                    isDealer={currentGame.dealerPosition === seat.seatNumber}
                    isCurrentPlayer={currentGame.currentPlayerTurn === seat.seatNumber}
                    isSmallBlind={currentGame.smallBlindPosition === seat.seatNumber}
                    isBigBlind={currentGame.bigBlindPosition === seat.seatNumber}
                    joinGame={handleJoinGame}
                    min={currentGame.min}
                    max={currentGame.max}
                    isInGame={false} // You'll need to set this based on your actual app logic
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - 15vh - Chat and Bet controls */}
      <div className="h-[15vh] min-h-[120px] bg-gray-800 border-t border-gray-700">
        <ChatBetSection 
          isInGame={true} 
          highestBet={currentGame.highestBet} 
          gameStage={currentGame.stage}
          gameRunning={currentGame.gameRunning}
        />
      </div>
    </div>
  );
};

export default Room;
