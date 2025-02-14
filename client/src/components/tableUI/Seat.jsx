import PropTypes from "prop-types";
import { useRef, useState } from "react";

export default function Seat({
  seat,
  joinGame,
  min,
  max,
  isDealer,
  isCurrentPlayer,
  isSmallBlind,
  isBigBlind,
  isInGame
}) {
  const modalRef = useRef(null);
  const [buyIn, setBuyIn] = useState(0);





  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleConfirm = () => {
    if (joinGame && seat && seat._id) {
      joinGame(seat._id, buyIn);
    }
    closeModal();
  };

  return (
    <div
      className={`bg-white rounded-full w-1/4 h-5/6 flex flex-col justify-center items-center ${
        isCurrentPlayer ? "border-4 border-green-500" : ""
      }`}
    >
      {!seat.player ? (
        <>
        {/* Button that needs to be disable if isUserSeat is true */}
          <button
            onClick={openModal}
            disabled={isInGame}
            className={`rounded-md py-2 px-3 ${
              isInGame ? "bg-gray-300 cursor-not-allowed" : "bg-blue-300"
            }`}
          >
            Join
          </button>
          <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Select Buy-In Amount</h3>
              <p className="py-4">
                Use the slider to choose how much you want to buy in for:
              </p>
              <input
                type="range"
                min={min}
                max={max}
                value={buyIn}
                onChange={(e) => setBuyIn(Number(e.target.value))}
                className="range range-primary"
              />
              <p className="text-center">Buy-In: ${buyIn}</p>
              <div className="modal-action">
                <button onClick={closeModal} className="btn">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="btn btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          </dialog>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <span className="text-md font-bold">$ {seat.player?.chips}</span>{" "}
          <span className="text-md font-bold">
            {seat.player?.user?.username}
          </span>
          {isSmallBlind && <p className="text-sm">S. B.</p>}
          {isBigBlind && <p className="text-sm">B. B.</p>}
          {isDealer && <div className="badge badge-primary badge-sm">D</div>}
        </div>
      )}
    </div>
  );
}

Seat.propTypes = {
  seat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    player: PropTypes.shape({
      user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  isDealer: PropTypes.bool.isRequired,
  isCurrentPlayer: PropTypes.bool.isRequired,
  isSmallBlind: PropTypes.bool.isRequired,
  isBigBlind: PropTypes.bool.isRequired,
  isInGame: PropTypes.bool.isRequired,

};
