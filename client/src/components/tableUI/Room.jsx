import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import { useCallback, useContext, useEffect, useState } from "react";
import { clearMessages, fetchGameById } from "../../features/games/gamesSlice";
import { SocketContext } from "../../context/SocketProvider";
import toast from "react-hot-toast";
import { seatStyling } from "../../data/seatStyle";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const { currentGame, successMessage, errorMessage } = useSelector(
    (state) => state.games
  );
console.log("C Game", currentGame)
  const user = useSelector((state) => state.auth.user);
  const socket = useContext(SocketContext);

  const [hasEmittedStart, setHasEmittedStart] = useState(false);
  const [dealtStage, setDealtStage] = useState("");

  // Boolean telling if user is in game
  const isUserInGame = (user, roomId) =>
    !!(
      user &&
      user.activeGames &&
      user.activeGames.some(
        (activeGameId) => activeGameId.toString() === roomId.toString()
      )
    );

  const isInGame = isUserInGame(user, roomId);

  // Provides Seat Data for user that is in game
  const seatData = (game, userId) => {
    if (!game || !game.seats) return null;
    const seat = game.seats.find((s) => {
      if (!s.player) return false;

      const seatUserId =
        typeof s.player.user === "object" ? s.player.user.id : s.player.user;
      return seatUserId === userId;
    });
    return seat
      ? {
          seatId: seat._id,
          chips: seat.player.chips,
          seatNumber: seat.seatNumber,
          action: seat.player.action,
          bet: seat.player.bet,
          handCards: seat.player.handCards,
        }
      : null;
  };

  const userSeatData =
    currentGame && user ? seatData(currentGame, user.id) : null;

  const isCurrentPlayer =
    userSeatData && userSeatData.seatNumber === currentGame.currentPlayerTurn;

  const playerChips = userSeatData && userSeatData.chips;

  const playerAction = userSeatData && userSeatData.action;

  const playerBetAmount = userSeatData && userSeatData.bet;
  const disableCheck = currentGame?.highestBet > 0 && playerAction === "none";

  const disableCallForBigBlind =
    currentGame?.highestBet === currentGame?.blinds.bigBlind &&
    playerAction === "postBigBlind";

  const playerCards = userSeatData ? userSeatData.handCards || [] : [];

  const handleJoinGame = (seatId, buyIn) => {
    if (!socket) return;

    const userId = user.id;
    socket.emit("playerJoin", {
      gameId: roomId,
      userId,
      buyIn,
      seatId,
    });
  };

  const handleDealFlop = useCallback(() => {
    if (!socket) return;
    socket.emit("dealFlop", { gameId: roomId });
  }, [socket, roomId]);

  const handleDealTurn = useCallback(() => {
    if (!socket) return;
    socket.emit("dealTurn", { gameId: roomId });
  }, [socket, roomId]);

  const handleDealRiver = useCallback(() => {
    if (!socket) return;
    socket.emit("dealRiver", { gameId: roomId });
  }, [socket, roomId]);

  const handleLeaveGame = () => {
    if (!socket) return;
    const userId = user.id;
    socket.emit("leaveGame", { gameId: roomId, userId });
  };

  const handleBet = (betAmount) => {
    console.log(`[handleBet] Called with betAmount: ${betAmount}`);
    if (!socket) {
      console.error("[handleBet] Socket is not available.");
      return;
    }
    socket.emit("bet", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      bet: betAmount,
      action: "bet",
    });
    console.log("[handleBet] Emitted bet event.");
  };

  const handleRaise = (betAmount) => {
    const effectiveBet = currentGame.highestBet + betAmount;
    console.log(
      `[handleRaise] Called with additional betAmount: ${betAmount}, effective raise: ${effectiveBet}`
    );
    if (!socket) {
      console.error("[handleRaise] Socket is not available.");
      return;
    }
    socket.emit("raise", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      bet: effectiveBet,
      action: "raise",
    });
    console.log("[handleRaise] Emitted raise event.");
  };

  const handleAllIn = () => {
    const allInBet = userSeatData.chips; // the player's total chips
    console.log(
      `[handleAllIn] Called for seat ${userSeatData.seatId} with allInBet: ${allInBet}`
    );
    if (!socket) {
      console.error("[handleAllIn] Socket is not available.");
      return;
    }
    socket.emit("allIn", {
      gameId: roomId,
      seatId: userSeatData.seatId,
    });
    console.log("[handleAllIn] Emitted allIn event.");
  };

  const handleCall = () => {
    if (!socket) {
      console.error("handleCheck: Socket is not available.");
      return;
    }

    const effectiveCall =
      currentGame.highestBet > playerChips
        ? playerChips
        : currentGame.highestBet;

    socket.emit("call", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      action: "call",
      bet: effectiveCall,
    });
  };

  const handleCheck = () => {
    if (!socket) {
      console.error("handleCheck: Socket is not available.");
      return;
    }
    socket.emit("check", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      action: "check",
    });
  };

  const handleFold = () => {
    if (!socket) {
      console.error("handleFold: Socket is not available.");
      return;
    }

    socket.emit("fold", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      action: "fold",
    });
    console.log("[handleFold] Emitted fold event with:", {
      gameId: roomId,
      seatId: userSeatData.seatId,
      action: "fold",
    });
  };

  // useEffect to updateGame
  useEffect(() => {
    dispatch(fetchGameById(roomId));
  }, [dispatch, roomId]);

  // toast
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
    if (
      currentGame &&
      currentGame.winnerData &&
      currentGame.winnerData.length > 0
    ) {
      currentGame.winnerData.forEach((winner) => {
        if (winner.message) {
          toast.success(winner.message);
        }
      });
    }
  }, [dispatch, successMessage, errorMessage, currentGame]);

  // just tracking local state of room we will remove (ITHINK)
  useEffect(() => {
    if (currentGame) {
      const playerCount = currentGame.seats.filter(
        (seat) => seat.player
      ).length;

      if (playerCount < 2 && hasEmittedStart) {
        setHasEmittedStart(false);
      }
    }
  }, [currentGame, hasEmittedStart]);

  // Triggers New Game / updatesPosBlind
  useEffect(() => {
    if (currentGame && socket) {
      const playerCount = currentGame.playerCount;

      if (playerCount >= 2 && !currentGame.gameRunning && !hasEmittedStart) {
        socket.emit("updatePositionsAndBlinds", { gameId: roomId });
        setHasEmittedStart(true);

        setTimeout(() => {
          socket.emit("dealCardsToPlayers", { gameId: roomId });
        }, 2000);
      }
    }
  }, [currentGame, socket, roomId, hasEmittedStart]);

  //Checks winner in case of surrender or showdown
  useEffect(() => {
    if (currentGame && roomId && socket) {
      if (currentGame.stage === "surrender") {
        socket.emit("getWinner", { gameId: roomId });
        setHasEmittedStart(false);
      } else if (currentGame.stage === "showdown") {
        const activeSeats = currentGame.seats.filter(
          (seat) =>
            seat.player &&
            seat.player.handCards &&
            seat.player.handCards.length > 0
        );

        if (activeSeats.length > 1) {
          socket.emit("getWinner", { gameId: roomId });
          setHasEmittedStart(false);
        }
      }
    }
  }, [currentGame, roomId, socket]);

  //Starts new round after game ends
  useEffect(() => {
    if (currentGame && currentGame.stage === "end" && !hasEmittedStart) {
      const activeSeats = currentGame.seats.filter(
        (seat) =>
          seat.player &&
          seat.player.handCards &&
          seat.player.handCards.length > 0
      );

      if (activeSeats.length >= 2) {
        setHasEmittedStart(true);

        setTimeout(() => {
          socket.emit("updatePositionsAndBlinds", { gameId: roomId });

          setTimeout(() => {
            socket.emit("dealCardsToPlayers", { gameId: roomId });
          }, 2000);
        }, 2000);
      }
    }
  }, [currentGame, roomId, socket, hasEmittedStart]);

  // Deals Flop Turn River
  useEffect(() => {
    if (!currentGame) return;
    const stage = currentGame.stage;

    if (
      (stage === "flop" || stage === "turn" || stage === "river") &&
      dealtStage !== stage
    ) {
      const allPlayersNotActed = currentGame.seats.every((seat) => {
        if (!seat.player) return true;
        return (
          seat.player.checkBetFold === false && seat.player.action === "none"
        );
      });

      if (allPlayersNotActed) {
        setDealtStage(stage);
        if (stage === "flop") {
          handleDealFlop();
        } else if (stage === "turn") {
          handleDealTurn();
        } else if (stage === "river") {
          handleDealRiver();
        }
      }
    }
  }, [
    currentGame,
    dealtStage,
    handleDealFlop,
    handleDealTurn,
    handleDealRiver,
  ]);

  //Default Showdown case
  useEffect(() => {
    if (currentGame && currentGame.stage === "defaultShowdown") {
      const communityCount = currentGame.communityCards.length;
      if (communityCount === 0) {
        handleDealFlop();
        setTimeout(() => {
          handleDealTurn();
          setTimeout(() => {
            handleDealRiver();
          }, 2000);
        }, 2000);
      } else if (communityCount === 3) {
        handleDealTurn();
        setTimeout(() => {
          handleDealRiver();
        }, 2000);
      } else if (communityCount === 4) {
        handleDealRiver();
      }
    }
  }, [currentGame, handleDealFlop, handleDealTurn, handleDealRiver]);

  if (!currentGame) return <p>Loading game...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top section - 5vh - Title and Exit Button */}
      <div className="h-[5vh] min-h-[40px] bg-gray-800 flex justify-between items-center px-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-bold">
          {currentGame.name}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm">
            <span className="text-gray-400">Blinds:</span> {currentGame.smallBlind} / {currentGame.bigBlind}
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
                    isInGame={isInGame} // You'll need to set this based on your actual app logic
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - 15vh - Chat and Bet controls */}
      <div className="h-[15vh] min-h-[120px] bg-gray-800 border-t border-gray-700">
      <Chat />
        <BetControl
          disableCheck={disableCheck}
          disableCallForBigBlind={disableCallForBigBlind}
          isCurrentPlayer={isCurrentPlayer}
          handleBet={handleBet}
          handleCheck={handleCheck}
          handleFold={handleFold}
          handleCall={handleCall}
          handleAllIn={handleAllIn}
          handleRaise={handleRaise}
          chips={playerChips}
          highestBet={currentGame.highestBet}
          hasCards={playerCards.length > 0}
        />
      </div>
    </div>
  );
}