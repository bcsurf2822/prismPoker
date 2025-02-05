import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames } from "../../features/games/gamesSlice";

export default function Games() {
  const dispatch = useDispatch();

  const { games, loading, error } = useSelector((state) => state.games);

  //Need to fix this so that the socket events update the games state here

  //Make sure redux updates individual game and all games

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // opens window without extra settings

  // const handleNavigateToRoom = (gameId) => {
  //   window.open(
  //     `/room/${gameId}`,
  //     "_blank",
  //     "width=800,height=600,top=100,left=100,noopener,noreferrer"
  //   );
  // };

  const handleNavigateToRoom = (gameId) => {
    // opens usual browser easier to work with in dev
    window.open(`/room/${gameId}`, "_blank");
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
              <td>
                <button
                  onClick={() => handleNavigateToRoom(game._id)}
                  className="btn btn-primary"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
