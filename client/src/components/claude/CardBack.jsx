import React from 'react';

const CardBack = () => {
  // I'm keeping your blue design for the card back as mentioned in your instructions
  return (
    <div className="w-[calc(8vw+20px)] h-[calc(11vw+28px)] min-w-10 min-h-14 max-w-20 max-h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center shadow-md">
      {/* Pattern design for the card back */}
      <div className="w-[70%] h-[70%] border-[1px] border-blue-300 rounded-sm flex items-center justify-center">
        <div className="w-[60%] h-[60%] border-[1px] border-blue-300 rounded-sm"></div>
      </div>
    </div>
  );
};

export default CardBack;