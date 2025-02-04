import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import { useContext, useEffect, useState } from "react";
import { fetchGameById, updateGame } from "../../features/games/gamesSlice";
import { SocketContext } from "../../context/socketContext";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.games.currentGame);
  console.log("C.Game: ", currentGame )
  const socket = useContext(SocketContext);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    // Fetch the game when entering the room
    dispatch(fetchGameById(roomId));

    // Listen for game updates
    if (socket) {
      socket.on("gameUpdated", (updatedGame) => {
        dispatch(updateGame(updatedGame));
      });

      // Listen for join success
      socket.on("joinSuccess", (data) => {
        console.log("Join successful:", data);
        // Optionally, update Redux state if needed
        dispatch(updateGame(data.game));
      });

      // Listen for join error
      socket.on("joinError", (data) => {
        console.error("Join error:", data.message);
        setJoinError(data.message);
      });
    } else {
      console.warn("Socket not available yet");
    }

    // Cleanup listeners on unmount
    return () => {
      if (socket) {
        socket.off("gameUpdated");
        socket.off("joinSuccess");
        socket.off("joinError");
      }
    };
  }, [dispatch, roomId, socket]);

  const handleJoinGame = (seatId, buyIn) => {
    // Ensure socket is connected and currentGame (or user info) is available
    if (!socket) return;
    // Assuming you have user id from a higher-level auth state, e.g., using useSelector((state) => state.auth.user.id)
    const userId = "someUserId"; // Replace with actual user id from your auth slice
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
        <Seat seat={currentGame.seats[0]} />
        <Seat seat={currentGame.seats[1]} />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
        <Seat seat={currentGame.seats[5]} />
          <Table />
          <Seat seat={currentGame.seats[2]} />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
        <Seat seat={currentGame.seats[4]} />
        <Seat seat={currentGame.seats[3]} />
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
