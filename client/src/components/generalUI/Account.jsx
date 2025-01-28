import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFunds } from "../../features/auth/authenticationSlice";

export default function Account() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
  
    // Allow only numbers and a single decimal point
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
    <div className="card card-side bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Account</h2>
        <p>Current Balance: ${user.accountBalance}</p>
        <div className="card-actions justify-end">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Enter Funds to Add</span>
            </div>
            <input
              type="text"
              placeholder="$"
              className="input input-bordered w-full max-w-xs"
              value={amount}
              onChange={handleInputChange}
            />
          </label>
          {error && <p className="text-red-500">{error}</p>}
          <button onClick={handleSubmit} className="btn btn-success">Submit</button>
        </div>
      </div>
    </div>
  );
}
