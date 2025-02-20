import PropTypes from "prop-types";
import cardsMap from "../../utils/cards";

export default function Card({ cardCode }) {
  const cardUrl = cardsMap[cardCode];

  if (!cardUrl) {
    return <div>Card not found</div>;
  }
  return (
    <div>
      <img
        src={cardUrl}
        alt={`Card ${cardCode}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

Card.propTypes = {
  cardCode: PropTypes.string.isRequired,
};
