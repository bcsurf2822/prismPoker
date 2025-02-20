import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Profile</h2>
        <p>
          <span className="font-bold">Username: </span>
          {user.username}
        </p>
        <p>
          <span className="font-bold">Email: </span>
          {user.email}
        </p>
        <p>
          <span className="font-bold">SC: </span>
          {user.accountBalance}
        </p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
}
