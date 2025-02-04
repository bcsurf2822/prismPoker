import PropTypes from "prop-types";

export default function Seat({ seatId, joinGame }) {


  const buyIn = 8;
  return (
    <div className="bg-white rounded-full w-1/4 h-5/6 flex justify-center items-center">
      <button
        onClick={() => joinGame && joinGame(seatId, buyIn)}
        className="bg-blue-300 rounded-md py-2 px-3"
      >
        Join
      </button>
    </div>
  );
}

Seat.propTypes = {
  joinGame: PropTypes.func.isRequired,
};
