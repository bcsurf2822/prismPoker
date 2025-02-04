import PropTypes from "prop-types";

export default function Seat({ seat, joinGame }) {
  const buyIn = 8;
  return (
    <div className="bg-white rounded-full w-1/4 h-5/6 flex justify-center items-center">
      <button
        onClick={() => joinGame && joinGame(seat._id, buyIn)}
        className="bg-blue-300 rounded-md py-2 px-3"
      >
        Join
      </button>
    </div>
  );
}

Seat.propTypes = {
  seat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    player: PropTypes.shape({
      user: PropTypes.string,
      chips: PropTypes.number,
      bet: PropTypes.number,
      action: PropTypes.oneOf([
        "check",
        "call",
        "bet",
        "all-in",
        "fold",
        "raise",
        "none",
      ]),
    }),
  }).isRequired,
  joinGame: PropTypes.func.isRequired,
};
