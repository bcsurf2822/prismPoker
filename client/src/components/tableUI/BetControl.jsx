export default function BetControl() {
  return (
    <div className="w-1/2 h-full flex flex-col gap-1">
      <div className=" flex justify-evenly">
        <button className="btn btn-info">Bet $</button>
        <button className="btn btn-success">Check</button>
        <button className="btn btn-error">Fold</button>
      </div>
      <div className="flex gap-1">
        <input type="range" min={0} max="100" value="40" className="range" />
        <input
          className="w-7 border border-green-600"
          type="text"
          name=""
          id=""
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
