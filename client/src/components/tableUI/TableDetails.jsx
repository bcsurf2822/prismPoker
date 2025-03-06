import React from 'react';
import Card from './Card';
import CardBack from './CardBack';

// This component only contains the community cards and pot display
const TableDetails = ({ communityCards = [], pot = 0 }) => {
  // If no community cards are provided, display 5 empty spaces
  const displayCards = communityCards.length > 0 
    ? communityCards 
    : [null, null, null, null, null];

  return (
    <>
      {/* Community cards */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1 sm:gap-2 md:gap-3">
        {displayCards.map((card, index) => {
          if (card) {
            return (
              <Card 
                key={index} 
                card={`${card.value}${card.suit[0]}`} 
                faceDown={false} 
              />
            );
          } else {
            return (
              <div key={index} className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24">
                <CardBack />
              </div>
            );
          }
        })}
      </div>
      
      {/* Pot amount */}
      <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-black/50 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-center">
          <span className="text-xs md:text-sm">Pot:</span>
          <span className="font-bold text-sm md:text-xl ml-1 md:ml-2">${pot}</span>
        </div>
      </div>
    </>
  );
};

export default TableDetails;