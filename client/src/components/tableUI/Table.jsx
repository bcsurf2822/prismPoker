import PropTypes from "prop-types";
import cardsMap from "../../utils/cards";

export default function Table({ pot, communityCards = [] }) {
  return (
    <main className="bg-green-600 border-2 border-black w-full rounded-full flex flex-col justify-evenly items-center ">
      <section>
        <p className="text-white">
          <span className="font-bold">Pot:</span> ${pot}
        </p>
      </section>
      <section className="flex justify-evenly gap-2 mt-10 w-3/4 h-28">
        {[0, 1, 2, 3, 4].map((index) => {
          const card = communityCards[index];
          return (
            <div
              key={index}
              className="bg-white w-1/12 rounded-md border-2 border-black flex items-center justify-center"
            >
              {card ? (
                <img
                  src={cardsMap[card.code]}
                  alt={`Card ${card.code}`}
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>
          );
        })}
      </section>
    </main>
  );
}

Table.propTypes = {
  pot: PropTypes.number.isRequired,
  communityCards: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      suit: PropTypes.string.isRequired,
    })
  ),
};
