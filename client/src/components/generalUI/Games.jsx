import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames } from "../../features/games/gamesSlice";
import { useOpenWindows } from "../../context/WindowContext";

export default function Games() {
  const dispatch = useDispatch();
  const { openWindows, setOpenWindows } = useOpenWindows();
  const { games, loading, error } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchGames());
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
  }, [openWindows, setOpenWindows]);

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

  const navigateToTestRoom = () => {
    const newWindow = window.open(`/room/test`, "_blank");
    return newWindow;
  };

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto bg-neutral-50 rounded-lg shadow-sm">
        <table className="table w-full">
          <thead className="bg-neutral-100">
            <tr className="text-neutral-600">
              <th className="py-3 px-4 text-left">Table</th>
              <th className="py-3 px-4 text-left">Blinds</th>
              <th className="py-3 px-4 text-left">Min/Max</th>
              <th className="py-3 px-4 text-left">Players</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const isOpen = openWindows[game.id] && !openWindows[game.id].closed;
              return (
                <tr key={game.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 text-neutral-700">{game.name}</td>
                  <td className="py-3 px-4 text-neutral-700">{game.blinds}</td>
                  <td className="py-3 px-4 text-neutral-700">
                    ${game.min} / ${game.max}
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    {game.playerCount} / 6
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleNavigateToRoom(game.id)}
                      className={`btn btn-sm ${
                        isOpen ? "btn-disabled bg-neutral-200 text-neutral-400" : "btn-primary"
                      }`}
                      disabled={isOpen}
                    >
                      {isOpen ? "Open" : "View"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* "To Test Game" Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={navigateToTestRoom}
          className="btn btn-outline btn-neutral"
        >
          To Test Game
        </button>
      </div>
    </div>
  );
}