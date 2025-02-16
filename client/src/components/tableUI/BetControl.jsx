import PropTypes from "prop-types";
import { useState } from "react";

export default function BetControl({
  handleBet,
  chips,
  handleFold,
  handleCheck,
  isCurrentPlayer,
}) {
  const [betAmount, setBetAmount] = useState(0);

  const handleRangeChange = (e) => {
    const newBet = Number(e.target.value);
    setBetAmount(newBet);
  };

  return (
    <div className="w-1/2 h-full flex flex-col gap-1">
      <div className=" flex justify-evenly">
        <button
          disabled={!isCurrentPlayer}
          className="btn btn-info"
          onClick={() => handleBet(betAmount, "bet")}
        >
          Bet ${betAmount}
        </button>
        <button
          disabled={!isCurrentPlayer}
          onClick={handleCheck}
          className="btn btn-success"
        >
          Check
        </button>
        <button disabled={!isCurrentPlayer} className="btn btn-success">
          Call
        </button>
        <button
          disabled={!isCurrentPlayer}
          onClick={handleFold}
          className="btn btn-error"
        >
          Fold
        </button>
      </div>
      <div className="flex gap-1">
        <input
          disabled={!isCurrentPlayer}
          type="range"
          min={0}
          max={chips}
          value={betAmount}
          onChange={handleRangeChange}
          className="range range-primary"
        />
        <input
          disabled={!isCurrentPlayer}
          type="text"
          value={betAmount}
          readOnly
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
  chips: PropTypes.number.isRequired,
  handleCheck: PropTypes.func.isRequired,
  handleFold: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.bool.isRequired,
};
