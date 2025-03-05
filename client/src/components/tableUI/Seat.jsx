import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Card from "./Card";
import CardBack from "./CardBack";

export default function Seat({
  seat,
  joinGame,
  min,
  max,
  isDealer,
  isCurrentPlayer,
  isSmallBlind,
  isBigBlind,
  isInGame,
  position,
  extraClasses,
}) {
  const modalRef = useRef(null);
  const [buyIn, setBuyIn] = useState(0);

  const cardCodes = seat.player?.handCards.map((card) => card.code);

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

  if (!seat.player) {
    return (
      <>
        <div
          className={`absolute ${position} transform ${extraClasses} z-10 pointer-events-auto`}
        >
          <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg flex flex-col items-center">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isInGame
                  ? "bg-gray-500 cursor-not-allowed text-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={openModal}
              disabled={isInGame}
            >
              Join
            </button>
            <div className="text-white text-xs mt-1">
              Seat {seat.seatNumber}
            </div>
          </div>
        </div>

        {/* Buy-in Modal - using dialog for better accessibility */}
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-white text-lg font-bold">
              Select Buy-In Amount
            </h3>
            <p className="py-4 text-gray-300">
              Use the slider to choose how much you want to buy in for:
            </p>
            <input
              type="range"
              min={min}
              max={max}
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-center text-white mt-2">Buy-In: ${buyIn}</p>
            <div className="modal-action">
              <button
                onClick={closeModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      </>
    );
  }

  // If there is a player in this seat, show the player info
  const hasCards = seat.player.handCards && seat.player.handCards.length > 0;

  return (
    <div
      className={`absolute ${position} transform ${extraClasses} z-10 pointer-events-auto`}
    >
      <div
        className={`bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg flex flex-col items-center 
        ${isCurrentPlayer ? "ring-2 ring-yellow-400" : ""}`}
      >
        {/* Cards container */}
        <div className="flex space-x-1 mb-1 md:mb-2">
          {hasCards ? (
            <>
              <div className="w-10 md:w-14">
                {seat.player.handCards && seat.player.handCards.length > 0 ? (
                  <Card
                    card={`${seat.player.handCards[0].value}${seat.player.handCards[0].suit[0]}`}
                  />
                ) : (
                  <CardBack />
                )}
              </div>
              <div className="w-10 md:w-14">
                {seat.player.handCards && seat.player.handCards.length > 1 ? (
                  <Card
                    card={`${seat.player.handCards[1].value}${seat.player.handCards[1].suit[0]}`}
                  />
                ) : (
                  <CardBack />
                )}
              </div>
            </>
          ) : (
            <div className="w-[calc(16vw+40px)] h-[calc(11vw+28px)] min-w-20 min-h-14 max-w-40 max-h-28 flex justify-center items-center">
              <span className="text-white/50 text-xs">No cards</span>
            </div>
          )}
        </div>

        {/* Player's chip count */}
        <div className="text-white bg-gray-800 px-2 py-1 rounded-md mb-1 md:mb-2 text-xs md:text-sm font-bold">
          ${seat.player.chips || 0}
        </div>

        {/* Player's name */}
        <div className="text-white text-xs md:text-base font-semibold">
          {seat.player.user?.username || "Player"}
        </div>

        {/* Action indicator */}
        {seat.player.action && seat.player.action !== "none" && (
          <div className="text-white text-xs md:text-sm mt-1">
            {seat.player.action}
          </div>
        )}

        {/* Position indicators */}
        <div className="flex gap-1 mt-1">
          {/* Dealer button */}
          {isDealer && (
            <div className="bg-white text-black rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs font-bold border-2 border-blue-500">
              D
            </div>
          )}

          {/* Small blind indicator */}
          {isSmallBlind && (
            <div className="bg-yellow-500 text-black rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs font-bold">
              SB
            </div>
          )}

          {/* Big blind indicator */}
          {isBigBlind && (
            <div className="bg-orange-500 text-black rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs font-bold">
              BB
            </div>
          )}
        </div>

        {/* Current bet amount */}
        {seat.player.bet > 0 && (
          <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs md:text-sm font-semibold">
            ${seat.player.bet}
          </div>
        )}
      </div>
    </div>
  );
}
Seat.propTypes = {
  seat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    seatNumber: PropTypes.number.isRequired,
    player: PropTypes.shape({
      user: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
        }),
      ]),
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
      handCards: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          suit: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          _id: PropTypes.string.isRequired,
        })
      ),
    }),
  }).isRequired,
  joinGame: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  isDealer: PropTypes.bool.isRequired,
  isCurrentPlayer: PropTypes.bool,
  isSmallBlind: PropTypes.bool.isRequired,
  isBigBlind: PropTypes.bool.isRequired,
  isInGame: PropTypes.bool.isRequired,
};
