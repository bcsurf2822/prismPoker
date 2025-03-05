import PropTypes from "prop-types";
import cardsMap from "../../utils/cards";
import CardBack from "./CardBack";

const Card = ({ card, faceDown }) => {
  if (faceDown || !card) {
    return <CardBack />;
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

Card.propTypes = {
  card: PropTypes.string,
  faceDown: PropTypes.bool
};

export default Card;