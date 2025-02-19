

export default function TestBet() {
  const isCurrentPlayer = true
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
            disabled={!isCurrentPlayer || !hasCards}
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

    </div>
  )
}
