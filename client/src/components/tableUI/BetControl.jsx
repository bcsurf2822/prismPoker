import PropTypes from "prop-types";
import { useState } from "react";

export default function BetControl({
  handleBet,
  handleRaise,
  handleAllIn,
  chips,
  handleFold,
  handleCheck,
  isCurrentPlayer,
  highestBet,
  handleCall,
  hasCards,
  disableCheck,
}) {
  const [betAmount, setBetAmount] = useState(1);

  const handleRangeChange = (e) => {
    const newBet = Number(e.target.value);
    setBetAmount(newBet);
  };

  const sliderMin = 1;
  const sliderMax = chips;

  return (
    <div className="w-1/2 h-full flex flex-col gap-1">
      <div className=" flex justify-evenly items-center">
        <div className="flex flex-col gap-1">
          <button
            disabled={!isCurrentPlayer || !hasCards}
            className="btn btn-info"
            onClick={() =>
              highestBet > 0 ? handleRaise(betAmount) : handleBet(betAmount)
            }
          >
            {highestBet > 0
              ? `Raise $${betAmount} + $${highestBet}`
              : `Bet $${betAmount}`}
          </button>
          <button
            disabled={!isCurrentPlayer || !hasCards}
            className="btn btn-info"
            onClick={handleAllIn}
          >
            All in $ {chips}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {" "}
          <button
            onClick={handleCall}
            disabled={!isCurrentPlayer || !hasCards || highestBet <= 0}
            className="btn btn-success"
          >
            {highestBet > chips ? `All in $${chips}` : `Call $${highestBet}`}
          </button>{" "}
          <button
            disabled={!isCurrentPlayer || !hasCards || disableCheck}
            onClick={handleCheck}
            className="btn btn-success"
          >
            Check
          </button>
        </div>

        <button
          disabled={!isCurrentPlayer || !hasCards}
          onClick={handleFold}
          className="btn btn-error"
        >
          Fold
        </button>
      </div>
      <div className="flex gap-1">
        <input
          disabled={!isCurrentPlayer || !hasCards}
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={betAmount}
          onChange={handleRangeChange}
          className="range range-primary"
        />
        <input
          disabled={!isCurrentPlayer || !hasCards}
          type="text"
          value={betAmount}
          onChange={handleRangeChange}
          className="w-7 border border-green-600 text-center"
        />
      </div>
      {/* <div className="flex flex-col items-start gap-1 text-xs">
        <div className="flex gap-2">
          <input type="radio" name="radio-1" className="radio" />
          <label>Sit Out</label>
        </div>
        <div className="flex gap-2">
          <input type="radio" name="radio-1" className="radio" />
          <label>Sit Out Next BB</label>
        </div>
        <div className="flex gap-2">
          <input type="radio" name="radio-1" className="radio" />
          <label>Fold to any bet</label>
        </div>
      </div> */}
    </div>
  );
}

BetControl.propTypes = {
  handleBet: PropTypes.func.isRequired,
  handleCall: PropTypes.func.isRequired,
  handleRaise: PropTypes.func.isRequired,
  handleAllIn: PropTypes.func.isRequired,
  chips: PropTypes.number,
  highestBet: PropTypes.number,
  handleCheck: PropTypes.func.isRequired,
  handleFold: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.bool,
  hasCards: PropTypes.bool,
  disableCheck: PropTypes.bool,
};
