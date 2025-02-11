import PropTypes from "prop-types";
import { useRef, useState } from "react";

export default function Seat({ seat, joinGame, min, max }) {
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
    <div className="bg-white rounded-full w-1/4 h-5/6 flex flex-col justify-center items-center">
      {!seat.player ? (
        <>
          <button
            onClick={openModal}
            className="bg-blue-300 rounded-md py-2 px-3"
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

          <span className="text-md font-bold">
            {seat.player?.user?.username}
          </span>
          <span className="text-md font-bold">$ {seat.player?.chips}</span>
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
      user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        accountBalance: PropTypes.number.isRequired,
        avatar: PropTypes.string.isRequired,
        bankBalance: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        lastLogin: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        __v: PropTypes.number.isRequired,
      }).isRequired,
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
};
