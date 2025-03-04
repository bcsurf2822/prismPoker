import Chat from "./Chat";

import TestSeat from "./TestSeat";
import TestTable from "./TestTable";
import { testGame } from "../../data/testData";

export default function TestRoom() {
  const currentGame = testGame;

  const isInGame = true;
  const handleJoinGame = () => {
    console.log("Joining Game");
  };

  return (
    <main className="w-full h-screen flex flex-col bg-slate-200">
      <section className="h-[12.5vh] flex justify-between items-center px-4 bg-slate-100">
        <h1 className="text-2xl font-bold">Test Table</h1>
        <button className="bg-red-300 rounded-md py-2 px-3">Leave</button>
      </section>
      <section className="flex flex-col justify-center items-center gap-2 w-full h-[80vh]">
        {/* Top Row */}
        <div className="flex gap-10 h-1/3 w-full items-center justify-center">
          <TestSeat
            seat={currentGame.seats[0]}
            joinGame={handleJoinGame}

            isDealer={currentGame.dealerPosition === 0}
            isCurrentPlayer={currentGame.currentPlayerTurn === 0}
            isSmallBlind={currentGame.smallBlindPosition === 0}
            isBigBlind={currentGame.bigBlindPosition === 0}
            isInGame={isInGame}
          />
          <TestSeat
            seat={currentGame.seats[1]}
            joinGame={handleJoinGame}
    
 
     
  
            isDealer={currentGame.dealerPosition === 1}
            isCurrentPlayer={currentGame.currentPlayerTurn === 1}
            isSmallBlind={currentGame.smallBlindPosition === 1}
            isBigBlind={currentGame.bigBlindPosition === 1}
            isInGame={isInGame}
          />
        </div>
        {/* Middle Row */}
        <div className="flex gap-5 w-full h-1/3 justify-center text-center px-4">
          <TestSeat
            seat={currentGame.seats[5]}
            joinGame={handleJoinGame}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 5}
            isCurrentPlayer={currentGame.currentPlayerTurn === 5}
            isSmallBlind={currentGame.smallBlindPosition === 5}
            isBigBlind={currentGame.bigBlindPosition === 5}
            isInGame={isInGame}
          />
          <TestTable
            communityCards={currentGame.communityCards}
            pot={currentGame.pot}
          />
          <TestSeat
            seat={currentGame.seats[2]}
            joinGame={handleJoinGame}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 2}
            isCurrentPlayer={currentGame.currentPlayerTurn === 2}
            isSmallBlind={currentGame.smallBlindPosition === 2}
            isBigBlind={currentGame.bigBlindPosition === 2}
            isInGame={isInGame}
          />
        </div>
        {/* Bottom Row */}
        <div className="flex gap-10 h-1/3 w-full items-center justify-center">
          <TestSeat
            seat={currentGame.seats[4]}
            joinGame={handleJoinGame}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 4}
            isCurrentPlayer={currentGame.currentPlayerTurn === 4}
            isSmallBlind={currentGame.smallBlindPosition === 4}
            isBigBlind={currentGame.bigBlindPosition === 4}
            isInGame={isInGame}
          />
          <TestSeat
            seat={currentGame.seats[3]}
            joinGame={handleJoinGame}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 3}
            isCurrentPlayer={currentGame.currentPlayerTurn === 3}
            isSmallBlind={currentGame.smallBlindPosition === 3}
            isBigBlind={currentGame.bigBlindPosition === 3}
            isInGame={isInGame}
          />
        </div>
      </section>
      <section className="h-[25vh] flex justify-between items-center px-4 bg-slate-100">
        {/* <TestBet /> */}
        <Chat />
      </section>
    </main>
  );
}
