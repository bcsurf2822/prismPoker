import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { logout } from "../../features/authenticationSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  console.log("User Nav", user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
  };

  return (
    <div className="navbar bg-neutral text-neutral-content flex">
      <button className="btn btn-ghost text-xl">PKR Poker</button>
      <ul className=" w-full flex justify-evenly">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/games">Games</NavLink>
        </li>
        {/* <li>
          <NavLink to="/settings">Settings</NavLink>
        </li> */}

        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error bg-neutral"
            >
              Log Out
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
