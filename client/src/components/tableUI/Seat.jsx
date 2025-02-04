import PropTypes from "prop-types";

export default function Seat({ seat, user, joinGame }) {
  console.log("SEAT: ", seat);
  const seatId = seat._id;
  const buyIn = 8;
  return (
    <div className="bg-white rounded-full w-1/4 h-5/6 flex justify-center items-center">
      <button className="bg-blue-300 rounded-md py-2 px-3">Join</button>
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
      checkBetFold: PropTypes.bool,
    }),
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    accountBalance: PropTypes.number.isRequired,
    bankBalance: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
    lastLogin: PropTypes.string.isRequired,
  }).isRequired,
  joinGame: PropTypes.func.isRequired,
};
