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
  key,
  user,
  position,
  extraClasses
}) {
  const player = seat?.player
  const modalRef = useRef(null);
  const [buyIn, setBuyIn] = useState(min || 0);
  const [showModal, setShowModal] = useState(false);

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

  const handleBuyInChange = (e) => {
    setBuyIn(parseInt(e.target.value, 10));
  };


  if (!player) {
    return (
      <>
        <div className={`absolute ${position} transform ${extraClasses} z-10 pointer-events-auto`}>
          <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg flex flex-col items-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              onClick={openModal}
            >
              Join
            </button>
            <div className="text-white text-xs mt-1">Seat </div>
          </div>
        </div>

        {/* Buy-in Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-80 md:w-96 p-6 border border-gray-700">
              <h3 className="text-white text-lg font-bold mb-4">Join Seat </h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Select Buy-in Amount:</label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">${min}</span>
                  <span className="text-white font-bold text-lg">${buyIn}</span>
                  <span className="text-gray-400">${max}</span>
                </div>
                <input 
                  type="range" 
                  min={min} 
                  max={max} 
                  step="10" 
                  value={buyIn} 
                  onChange={handleBuyInChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  onClick={handleConfirm}
                >
                  Join Table
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`absolute ${position} transform ${extraClasses} z-10 pointer-events-auto`}>
      <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg flex flex-col items-center">
        {/* Cards container */}
        <div className="flex space-x-1 mb-1 md:mb-2">
          {player.hasCards ? (
            <>
              <CardBack />
              <CardBack />
            </>
          ) : (
            <div className="w-[calc(16vw+40px)] h-[calc(11vw+28px)] min-w-20 min-h-14 max-w-40 max-h-28 flex justify-center items-center">
              <span className="text-white/50 text-xs">No cards</span>
            </div>
          )}
        </div>
        
        {/* Player's chip count */}
        <div className="text-white bg-gray-800 px-2 py-1 rounded-md mb-1 md:mb-2 text-xs md:text-sm font-bold">
          ${player.chips || 0}
        </div>
        
        {/* Player's name */}
        <div className="text-white text-xs md:text-base font-semibold">{player.name}</div>
        
        {/* Dealer button */}
        {player.isDealer && (
          <div className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 bg-white text-black rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs font-bold border-2 border-blue-500">
            D
          </div>
        )}
        
        {/* Current bet amount */}
        {player.currentBet > 0 && (
          <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs md:text-sm font-semibold">
            ${player.currentBet}
          </div>
        )}
      </div>
    </div>
  );
};

// export default Seat;
  
// OLD RETURN **!!!--------------------------------
//   return (
//     <div
//       className={`bg-white rounded-full w-1/4 h-5/6 flex flex-col justify-center items-center ${
//         isCurrentPlayer ? "border-4 border-green-500" : ""
//       }`}
//     >
//       {!seat.player ? (
//         <>
//           <button
//             onClick={openModal}
//             disabled={isInGame}
//             className={`rounded-md py-2 px-3 ${
//               isInGame ? "bg-gray-300 cursor-not-allowed" : "bg-blue-300"
//             }`}
//           >
//             Join
//           </button>
//           <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
//             <div className="modal-box">
//               <h3 className="font-bold text-lg">Select Buy-In Amount</h3>
//               <p className="py-4">
//                 Use the slider to choose how much you want to buy in for:
//               </p>
//               <input
//                 type="range"
//                 min={min}
//                 max={max}
//                 value={buyIn}
//                 onChange={(e) => setBuyIn(Number(e.target.value))}
//                 className="range range-primary"
//               />
//               <p className="text-center">Buy-In: ${buyIn}</p>
//               <div className="modal-action">
//                 <button onClick={closeModal} className="btn">
//                   Cancel
//                 </button>
//                 <button onClick={handleConfirm} className="btn btn-primary">
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </dialog>
//         </>
//       ) : (
//         <div className="relative flex flex-col items-center">
//           {/* Cards Container */}
//           <div className="flex w-7/12 gap-2 justify-center items-center">
//             {/* First card container */}
//             <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
//               {cardCodes && cardCodes.length > 0 && cardCodes[0] ? (
//                 <Card cardCode={cardCodes[0]} />
//               ) : (
//                 <CardBack />
//               )}
//             </div>

//             {/* Second card container */}
//             <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
//               {cardCodes && cardCodes.length > 1 && cardCodes[1] ? (
//                 <Card cardCode={cardCodes[1]} />
//               ) : (
//                 <CardBack />
//               )}
//             </div>
//           </div>
//           {/* Username / Pot container */}
//           <div className="absolute top-10 left-5 w-5/6 h-full flex flex-col items-center justify-center z-10 pointer-events-none bg-white border border-neutral-300">
//             <div className="badge badge-neutral mb-2">
//               {seat.player?.user?.username}
//             </div>
//             <span className="text-md font-bold bg-white/80 px-1 rounded">
//               ${seat.player?.chips}
//             </span>
//             <div className="flex justify-center items-center">
//               {isDealer && (
//                 <div className="badge badge-primary badge-sm">D</div>
//               )}
//               {isSmallBlind && <p className="text-sm font-bold">S. B.</p>}
//               {isBigBlind && <p className="text-sm font-bold">B. B.</p>}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
