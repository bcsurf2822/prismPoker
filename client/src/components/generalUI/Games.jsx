import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames } from "../../features/games/gamesSlice";

export default function Games() {
  const dispatch = useDispatch();
  const [openWindows, setOpenWindows] = useState({});

  const { games, loading, error } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchGames());
    dispatch({ type: "websocket/listenToRoomEvents" });

    return () => {
      dispatch({ type: "websocket/stopListeningToRoomEvents" });
    };
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(openWindows).forEach((gameId) => {
        const win = openWindows[gameId];
        if (win && win.closed) {
          setOpenWindows((prev) => {
            const updated = { ...prev };
            delete updated[gameId];
            return updated;
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [openWindows]);

  // opens window without extra settings

  // const handleNavigateToRoom = (gameId) => {
  //   window.open(
  //     `/room/${gameId}`,
  //     "_blank",
  //     "width=800,height=600,top=100,left=100,noopener,noreferrer"
  //   );
  // };

  const handleNavigateToRoom = (gameId) => {
    const existingWindow = openWindows[gameId];
    if (existingWindow && !existingWindow.closed) {
      existingWindow.focus();
      return;
    }
    const newWindow = window.open(`/room/${gameId}`, "_blank");

    newWindow.onbeforeunload = () => {
      setOpenWindows((prev) => {
        const updated = { ...prev };
        delete updated[gameId];
        return updated;
      });
    };
    setOpenWindows((prev) => ({ ...prev, [gameId]: newWindow }));
  };

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-green-100 rounded-md pr-3">
      <table className="table">
        <thead>
          <tr className="text-center">
            <th></th>
            <th>Table</th>
            <th>Blinds</th>
            <th>Min/Max</th>
            <th>Players</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const isOpen =
              openWindows[game._id] && !openWindows[game._id].closed;
            return (
              <tr key={game._id} className="hover">
                <td></td>
                <td>{game.name}</td>
                <td>{game.blinds}</td>
                <td>
                  {game.min} / ${game.max}
                </td>
                <td>{game.playerCount} / 6</td>
                <td>
                  <button
                    onClick={() => handleNavigateToRoom(game._id)}
                    className="btn btn-primary"
                    disabled={isOpen}
                  >
                    {isOpen ? "Opened" : "View"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
