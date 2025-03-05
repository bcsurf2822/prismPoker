import PropTypes from "prop-types";
import cardsMap from "../../utils/cards";
import Card from "./Card";

export default function Table({ potAmount, communityCards = [] }) {
  const communityCardSlots = Array(5).fill(null);
  
  // Fill the slots with actual cards when available
  communityCards.forEach((card, index) => {
    if (index < 5) {
      communityCardSlots[index] = card;
    }
  });
  return (
    <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center py-2">
      <div className="relative w-full aspect-[1.7/1] mx-auto">
        {/* Main table */}
        <div className="absolute inset-0 bg-green-800 rounded-[45%] border-4 md:border-8 border-amber-900 shadow-xl flex items-center justify-center">
          {/* Inner felt */}
          <div className="absolute inset-[5%] bg-green-700 rounded-[40%]">
            
            {/* Community cards */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1 sm:gap-2 md:gap-3">
            {communityCardSlots.map((card, index) => (
                <Card 
                  key={index} 
                  card={card} 
                  faceDown={!card} 
                />
              ))}
            </div>
            
            {/* Pot amount */}
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black/50 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-center">
                <span className="text-xs md:text-sm">Pot:</span>
                <span className="font-bold text-sm md:text-xl ml-1 md:ml-2">${potAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  potAmount: PropTypes.number.isRequired,
  communityCards: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      suit: PropTypes.string.isRequired,
    })
  ),
};
//  return (
//     <main className="bg-green-600 border-4 border-green-800 w-full rounded-full flex flex-col justify-evenly items-center relative shadow-xl">
//       <section>
//         <p className="text-white">
//           <span className="font-bold">Pot:</span> ${pot}
//         </p>
//       </section>
      
//       {/* Community cards */}
//       <section className="flex justify-evenly gap-2 mt-2 w-3/4 h-28">
//         {[0, 1, 2, 3, 4].map((index) => {
//           const card = communityCards[index];
//           return (
//             <div
//               key={index}
//               className="bg-white w-1/12 rounded-md border-2 border-black flex items-center justify-center"
//             >
//               {card ? (
//                 <img
//                   src={cardsMap[card.code]}
//                   alt={`Card ${card.code}`}
//                   className="w-full h-full object-contain"
//                 />
//               ) : null}
//             </div>
//           );
//         })}
//       </section>
//     </main>
//   );
// }