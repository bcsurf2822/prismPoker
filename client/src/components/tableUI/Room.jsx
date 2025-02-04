import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";
import Seat from "./Seat";
import BetControl from "./BetControl";
import Chat from "./Chat";
import SocketService from "../../features/websockets/socketService";
import { useContext, useEffect } from "react";
import { fetchGameById, updateGame } from "../../features/games/gamesSlice";
import { SocketContext } from "../../context/socketContext";

export default function Room() {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.games.currentGame);
  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchGameById(roomId));

    if (socket) {
      socket.on("gameUpdated", (updatedGame) => {
        dispatch(updateGame(updatedGame));
      });
    } else {
      console.warn("Socket is not ready");
    }

    return () => {
      if (socket) {
        socket.off("gameUpdated");
      }
    };
  }, [dispatch, roomId, socket]);

  if (!currentGame) return <p>Loading game...</p>;

  return (
    <main className="w-full min-h-screen flex flex-col justify-center bg-slate-200  ">
      <h1 className="text-2xl font-bold">{currentGame.name}</h1>
      <section className="flex flex-col justify-center  items-center gap-2 w-full h-[70vh] bg-blue-700">
        {/* top */}
        <div className="flex gap-10 h-1/3  w-1/2 items-center justify-center">
          <Seat />
          <Seat />
        </div>
        {/* mid */}
        <div className="flex gap-5 w-full h-1/3  justify-center  text-center px-4">
          <Seat />
          <Table />
          <Seat />
        </div>
        {/* btm */}
        <div className="flex gap-10 h-1/3 w-1/2 items-center justify-center">
          <Seat />
          <Seat />
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
