import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import { useContext, useEffect, useState } from "react";
import { clearMessages, fetchGameById } from "../../features/games/gamesSlice";

import { rehydrateUser } from "../../features/auth/authenticationSlice";
import { SocketContext } from "../../context/SocketProvider";
import toast from "react-hot-toast";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const { currentGame, successMessage, errorMessage } = useSelector(
    (state) => state.games
  );

  const user = useSelector((state) => state.auth.user);
  const socket = useContext(SocketContext);

  const [hasEmittedStart, setHasEmittedStart] = useState(false);

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
  }, [dispatch, successMessage, errorMessage]);

  // useEffect to listen for socket room events
  useEffect(() => {
    dispatch(fetchGameById(roomId));
    if (!user) dispatch(rehydrateUser());

    dispatch({ type: "websocket/listenToRoomEvents" });
    dispatch({ type: "websocket/listenToUserEvents" });

    return () => {
      dispatch({ type: "websocket/stopListeningToRoomEvents" });
      dispatch({ type: "websocket/listenToUserEvents" });
    };
  }, [dispatch, roomId, user]);

  // just tracking state of room we will remove (ITHINK)
  useEffect(() => {
    if (currentGame) {
      const playerCount = currentGame.seats.filter(
        (seat) => seat.player
      ).length;

      if (playerCount < 2 && hasEmittedStart) {
        console.log("Player count dropped below 2. Resetting hasEmittedStart.");
        setHasEmittedStart(false);
      }
    }
  }, [currentGame, hasEmittedStart]);

  // Triggers New Game / updatesPosBlind
  useEffect(() => {
    if (currentGame && socket) {
      const playerCount = currentGame.playerCount;
      console.log(
        "Player count:",
        playerCount,
        "gameRunning:",
        currentGame?.gameRunning,
        "Emit Started? :",
        hasEmittedStart
      );

      if (playerCount >= 2 && !currentGame.gameRunning && !hasEmittedStart) {
        console.log(
          "Sufficient players detected, emitting updatePositionsAndBlinds"
        );
        socket.emit("updatePositionsAndBlinds", { gameId: roomId });
        setHasEmittedStart(true);

        setTimeout(() => {
          console.log("Emitting dealCardsToPlayers");
          socket.emit("dealCardsToPlayers", { gameId: roomId });
        }, 2000);
      }
    }
  }, [currentGame, socket, roomId, hasEmittedStart]);

  const handleJoinGame = (seatId, buyIn) => {
    if (!socket) return;

    const userId = user._id || user.id;
    socket.emit("playerJoin", {
      gameId: roomId,
      userId,
      buyIn,
      seatId,
    });
  };

  const handleLeaveGame = () => {
    if (!socket) return;
    const userId = user._id || user.id;
    socket.emit("leaveGame", { gameId: roomId, userId });
  };

  if (!currentGame) return <p>Loading game...</p>;

  return (
    <main className="w-full h-screen flex flex-col bg-slate-200">
      <section className="h-[12.5vh] flex justify-between items-center px-4 bg-slate-100">
        <h1 className="text-2xl font-bold">{currentGame.name}</h1>
        <button className="bg-green-300 rounded-md py-2 px-3">Start</button>
        <button className="bg-red-300 rounded-md py-2 px-3">End</button>
        <button
          onClick={handleLeaveGame}
          className="bg-red-300 rounded-md py-2 px-3"
        >
          Leave
        </button>
      </section>
      <section className="  flex flex-col justify-center  items-center gap-2 w-full h-[80vh] ">
        {/* top */}
        <div className="bg-red-400 flex gap-10 h-1/3  w-full items-center justify-center">
          <Seat
            seat={currentGame.seats[0]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 0}
            isCurrentPlayer={currentGame.currentPlayerTurn === 0}
            isSmallBlind={currentGame.smallBlindPosition === 0}
            isBigBlind={currentGame.bigBlindPosition === 0}
          />
          <Seat
            seat={currentGame.seats[1]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 1}
            isCurrentPlayer={currentGame.currentPlayerTurn === 1}
            isSmallBlind={currentGame.smallBlindPosition === 1}
            isBigBlind={currentGame.bigBlindPosition === 1}
          />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3 justify-center  text-center px-4">
          <Seat
            seat={currentGame.seats[5]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 5}
            isCurrentPlayer={currentGame.currentPlayerTurn === 5}
            isSmallBlind={currentGame.smallBlindPosition === 5}
            isBigBlind={currentGame.bigBlindPosition === 5}
          />

          <Table pot={currentGame.pot} />

          <Seat
            seat={currentGame.seats[2]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 2}
            isCurrentPlayer={currentGame.currentPlayerTurn === 2}
            isSmallBlind={currentGame.smallBlindPosition === 2}
            isBigBlind={currentGame.bigBlindPosition === 2}
          />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-full items-center justify-center">
          <Seat
            seat={currentGame.seats[4]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 4}
            isCurrentPlayer={currentGame.currentPlayerTurn === 4}
            isSmallBlind={currentGame.smallBlindPosition === 4}
            isBigBlind={currentGame.bigBlindPosition === 4}
          />
          <Seat
            seat={currentGame.seats[3]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
            isDealer={currentGame.dealerPosition === 3}
            isCurrentPlayer={currentGame.currentPlayerTurn === 3}
            isSmallBlind={currentGame.smallBlindPosition === 3}
            isBigBlind={currentGame.bigBlindPosition === 3}
          />
        </div>
      </section>
      <section className="h-[25vh] flex justify-between items-center px-4 bg-slate-100">
        <Chat />
        <BetControl />
      </section>
    </main>
  );
}
