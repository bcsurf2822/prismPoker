import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import { useContext, useEffect, useState } from "react";
import { fetchGameById, updateGame } from "../../features/games/gamesSlice";
import { SocketContext } from "../../context/socketContext";
import { rehydrateUser } from "../../features/auth/authenticationSlice";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.games.currentGame);
  const user = useSelector((state) => state.auth.user);
  console.log("USER", user);
  console.log("C.Game: ", currentGame);
  const socket = useContext(SocketContext);
  const [joinError, setJoinError] = useState(null);

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
        // Optionally, update Redux state if needed
        dispatch(updateGame(data.game));
      });

      socket.on("joinError", (data) => {
        console.error("Join error:", data.message);
        setJoinError(data.message);
      });
    } else {
      console.warn("Socket not available yet");
    }

    return () => {
      if (socket) {
        socket.off("gameUpdated");
        socket.off("joinSuccess");
        socket.off("joinError");
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

  if (!currentGame) return <p>Loading game...</p>;

  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-200  ">
      <h1 className="text-2xl font-bold">{currentGame.name}</h1>
      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-10 h-1/3  w-1/2 items-center justify-center">
          <Seat
            seatId={currentGame.seats[0]._id}
            joinGame={handleJoinGame}
            user={user}
          />
          <Seat seatId={currentGame.seats[1]._id} />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
          <Seat
            seatId={currentGame.seats[5]._id}
            joinGame={handleJoinGame}
            user={user}
          />
          <Table />
          <Seat
            seatId={currentGame.seats[2]._id}
            joinGame={handleJoinGame}
            user={user}
          />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
          <Seat
            seatId={currentGame.seats[4]._id}
            joinGame={handleJoinGame}
            user={user}
          />
          <Seat
            seatId={currentGame.seats[3]._id}
            joinGame={handleJoinGame}
            user={user}
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
