import PropTypes from "prop-types";
import cardsMap from "../../utils/cards";

export default function Card({ card, faceDown }) {
  // If card is faceDown or not provided, show card back
  if (faceDown || !card) {
    return (
      <div className="w-[calc(8vw+20px)] h-[calc(11vw+28px)] min-w-10 min-h-14 max-w-20 max-h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center shadow-md">
        <div className="w-[85%] h-[85%] rounded-sm bg-blue-600 flex items-center justify-center">
          <div className="w-3/4 h-3/4 border-2 border-blue-300 rounded-sm opacity-30"></div>
        </div>
      </div>
    );
  }

  // For face-up cards, show the card image
  return (
    <div className="w-[calc(8vw+20px)] h-[calc(11vw+28px)] min-w-10 min-h-14 max-w-20 max-h-28 bg-white rounded-md flex items-center justify-center border border-gray-300 shadow-md">
      <img
        src={cardsMap[card.code]}
        alt={`${card.value} of ${card.suit}`}
        className="w-[90%] h-[90%] object-contain"
      />
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.shape({
    code: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    suit: PropTypes.string.isRequired,
  }),
  faceDown: PropTypes.bool
};

Card.defaultProps = {
  faceDown: false
};