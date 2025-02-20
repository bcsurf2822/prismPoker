import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames } from "../../features/games/gamesSlice";
import { useOpenWindows } from "../../context/WindowContext";
import { motion } from "motion/react";
import { FaRegWindowMaximize } from "react-icons/fa";
import PropTypes from "prop-types";

const WindowAnimation = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, rotate: 0 }}
      animate={{ y: -150, opacity: 0, rotate: 360 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
      style={{ width: "50px", height: "50px" }}
    >
      <FaRegWindowMaximize size={50} />
    </motion.div>
  );
};

WindowAnimation.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default function Games() {
  const [animateEnvelope, setAnimateEnvelope] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState(null);
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

  const handleNavigateToRoom = (gameId) => {
    const existingWindow = openWindows[gameId];
    if (existingWindow && !existingWindow.closed) {
      existingWindow.focus();
      return;
    }
    setTargetRoomId(gameId);
    setAnimateEnvelope(true);
  };

  const handleAnimationComplete = () => {
    const newWindow = window.open(`/room/${targetRoomId}`, "_blank");
    newWindow.onbeforeunload = () => {
      setOpenWindows((prev) => {
        const updated = { ...prev };
        delete updated[targetRoomId];
        return updated;
      });
    };
    setOpenWindows((prev) => ({ ...prev, [targetRoomId]: newWindow }));
    setAnimateEnvelope(false);
    setTargetRoomId(null);
  };

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto bg-neutral-50 rounded-lg shadow-lg border-x-2">
        <table className="table w-full">
          <thead className="bg-neutral-200">
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
              const isOpen =
                openWindows[game.id] && !openWindows[game.id].closed;
              return (
                <tr
                  key={game.id}
                  className="hover:bg-neutral-100 transition-colors"
                >
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
                        isOpen
                          ? "btn-disabled bg-neutral-200 text-neutral-400"
                          : "btn-primary"
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
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => window.open(`/room/test`, "_blank")}
          className="btn btn-outline btn-neutral"
        >
          To Test Game
        </button>
      </div>
      {animateEnvelope && (
        <WindowAnimation onComplete={handleAnimationComplete} />
      )}
    </div>
  );
}
