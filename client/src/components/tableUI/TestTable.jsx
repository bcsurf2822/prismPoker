import { testCards3, testCards4, testCards5 } from "../../data/testData";
import cardsMap from "../../utils/cards";

export default function TestTable() {
  const communityCards = {empty: [], flop:testCards3, turn: testCards4, river: testCards5} 
  return (
    <main className="bg-green-600 border-2 border-black w-full rounded-full flex flex-col justify-evenly items-center ">
    <section>
      <p className="text-white">
        <span className="font-bold">Pot:</span> $5
      </p>
    </section>
    <section className="flex justify-evenly gap-2 mt-10 w-3/4 h-28">
        {[0, 1, 2, 3, 4].map((index) => {
          // Can mess around with 0-5 cards here (empty flop turn river)
          const card = communityCards.flop[index];
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