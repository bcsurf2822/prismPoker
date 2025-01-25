import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { fetchGames, updateGame } from "../../features/games/gamesSlice";
import { useNavigate } from "react-router";

const socket = io("http://localhost:4000");

export default function Games() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { games, loading, error } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchGames());

    socket.on("gamesUpdated", (updatedGame) => {
      dispatch(updateGame(updatedGame));
    });

    return () => {
      socket.off("gameUpdated");
    };
  }, [dispatch]);

  const handleNavigateToRoom = (gameId) => {
    console.log("Navigating to Room with ID:", gameId);
    if (gameId) {
      navigate(`/room/${gameId}`);
    } else {
      console.error("Game ID is undefined!");
    }
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
          {games.map((game) => (
            <tr key={game._id} className="hover">
              <td></td>
              <td>{game.name}</td>
              <td>{game.blinds}</td>
              <td>
                {game.min} / ${game.max}
              </td>
              <td>{game.playerCount} / 6</td>
              <button
    onClick={() => handleNavigateToRoom(game._id)}
                className="btn btn-primary"
              >
                Join
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
