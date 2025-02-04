import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import { useContext, useEffect, useState } from "react";
import { fetchGameById, updateGame } from "../../features/games/gamesSlice";

import { rehydrateUser } from "../../features/auth/authenticationSlice";
import { SocketContext } from "../../context/SocketProvider";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.games.currentGame);
  const user = useSelector((state) => state.auth.user);
  const socket = useContext(SocketContext);
  const [joinError, setJoinError] = useState(null);
  const [leaveError, setLeaveError] = useState(null);

    console.log("USER", user);
  // console.log("C.Game: ", currentGame);
  
  
  useEffect(() => {
    dispatch(fetchGameById(roomId));

    if (!user) {
      dispatch(rehydrateUser());
    }

    if (socket) {
      socket.on("gameUpdated", (updatedGame) => {
        dispatch(updateGame(updatedGame));
      });

      socket.on("joinSuccess", (data) => {
        console.log("Join successful:", data);
        dispatch(updateGame(data.game));
      });

      socket.on("joinError", (data) => {
        console.error("Join error:", data.message);
        setJoinError(data.message);
      });

      socket.on("gameLeft", (data) => {
        console.log("Leave successful:", data);
        // Optionally, you could navigate away or update state here.
      });

      socket.on("leaveGameError", (data) => {
        console.error("Leave game error:", data.message);
        setLeaveError(data.message);
      });
    } else {
      console.warn("Socket not available yet");
    }

   return () => {
      if (socket) {
        socket.off("gameUpdated");
        socket.off("joinSuccess");
        socket.off("joinError");
        socket.off("gameLeft");
        socket.off("leaveGameError");
      }
    };
  }, [dispatch, roomId, socket, user]);

  const handleJoinGame = (seatId, buyIn) => {
    console.log(`attempting to join seat : ${seatId} with ${buyIn}`);

    if (!socket) return;

    const userId = user.id;
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
    console.log(`User ${userId} is leaving game ${roomId}`);
    socket.emit("leaveGame", { gameId: roomId, userId });
  };


  if (!currentGame) return <p>Loading game...</p>;

  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-200  ">
          {joinError && <p className="text-red-500">{joinError}</p>}
          {leaveError && <p className="text-red-500">{leaveError}</p>}
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold">{currentGame.name}</h1>
        <button onClick={handleLeaveGame}  className="bg-red-300 rounded-md py-2 px-3">Leave</button>
      </div>

      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-10 h-1/3  w-1/2 items-center justify-center">
          <Seat
            seat={currentGame.seats[0]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
          <Seat
            seat={currentGame.seats[1]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
          <Seat
            seat={currentGame.seats[5]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
          <Table />
          <Seat
            seat={currentGame.seats[2]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
          <Seat
            seat={currentGame.seats[4]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
          <Seat
            seat={currentGame.seats[3]}
            joinGame={handleJoinGame}
            user={user}
            min={currentGame.min}
            max={currentGame.max}
          />
        </div>
      </section>
      <section>
        <div className="flex justify-between">
          <BetControl />
          <Chat />
        </div>
      </section>
    </main>
  );
}
