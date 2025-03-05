import React from 'react';
import cardsMap from '../../utils/cardsMap';

const Card = ({ card, faceDown }) => {
  if (faceDown || !card) {
    // Use CardBack component for consistency
    return (
      <div className="w-[calc(8vw+20px)] h-[calc(11vw+28px)] min-w-10 min-h-14 max-w-20 max-h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center shadow-md">
        <div className="w-[70%] h-[70%] border-[1px] border-blue-300 rounded-sm flex items-center justify-center">
          <div className="w-[60%] h-[60%] border-[1px] border-blue-300 rounded-sm"></div>
        </div>
      </div>
    );
  }

  // Get card image path from the cardsMap
  const cardImageUrl = cardsMap[card];
  
  return (
    <div className="w-[calc(8vw+20px)] h-[calc(11vw+28px)] min-w-10 min-h-14 max-w-20 max-h-28 bg-white rounded-md flex items-center justify-center border border-gray-300 shadow-md overflow-hidden">
      {cardImageUrl ? (
        <img 
          src={cardImageUrl} 
          alt={`Card ${card}`} 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-center text-sm md:text-lg font-bold">{card}</span>
        </div>
      )}
    </div>
  );
};

export default Card;