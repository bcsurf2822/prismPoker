import { useSelector } from "react-redux";

export default function Account() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Account</h2>
        <p>Current Balance: ${user.accountBalance}</p>
        <div className="card-actions justify-end">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Add Funds Here</span>
            </div>
            <input
              type="text"
              placeholder="$"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <button className="btn btn-success">Success</button>
        </div>
      </div>
    </div>
  );
}
