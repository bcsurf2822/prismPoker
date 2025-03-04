import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFunds } from "../../features/auth/authenticationSlice";
import Counter from "./Counter";

export default function Account() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    dispatch(addFunds({ amount: numericAmount }))
      .unwrap()
      .then(() => {
        setAmount("");
      })
      .catch((err) => {
        console.error("Error adding funds:", err);
        setError("Failed to add funds. Please try again.");
      });
  };

  return (
    <div className="card card-side bg-base-100 shadow-xl p-4">
      <div className="card-body flex flex-col gap-4">
        <h2 className="card-title font-bold text-center underline">Account</h2>
        <p>
          <span className="font-bold">Current Balance: $</span>
          {user ? <Counter value={user.accountBalance} /> : "0"}
        </p>
        <label className="form-control w-full max-w-xs">
          <span className="label-text font-semibold">Enter Funds to Add</span>
          <input
            type="text"
            placeholder="$"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            onChange={handleInputChange}
          />
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleSubmit} className="btn btn-success">
          Submit
        </button>
      </div>
    </div>
  );
}
