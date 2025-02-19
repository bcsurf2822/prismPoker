import  { useRef, useState } from "react";

export default function TestSeat(
  seat,
  joinGame,
  user,
  min,
  max,
  isDealer,
  isCurrentPlayer,
  isSmallBlind,
  isBigBlind,
  isInGame,
) {
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

  return (
    <div className="bg-white rounded-full w-1/4 h-5/6 flex flex-col justify-center items-center">
      {!seat.player ? (
        <>
          <button
            onClick={openModal}
            disabled={isInGame}
            className={`rounded-md py-2 px-3 ${
              isInGame ? "bg-gray-300 cursor-not-allowed" : "bg-blue-300"
            }`}
          >
            Join
          </button>
          {/* Modal for joining (won't be used for occupied seats) */}
        </>
      ) : (
        <div className="relative flex flex-col items-center">
          <div className="text-center">
            <p className="font-bold">{seat.player.user.username}</p>
            <p>${seat.player.chips}</p>
            {isDealer && <span>Dealer</span>}
            {isSmallBlind && <span>SB</span>}
            {isBigBlind && <span>BB</span>}
          </div>
        </div>
      )}
    </div>
  );
}