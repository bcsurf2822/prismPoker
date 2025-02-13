import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { logoutUser } from "../../features/auth/authenticationSlice";
import { useNavigate } from "react-router";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("authToken");
    navigate("/");
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

        {user && (
          <>
            <li className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                Settings
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/account">Account</NavLink>
                </li>
              </ul>
            </li>
            <li>
              <p className="font-bold">{user.username}</p>
              <p className="font-bold">SC: ${user.accountBalance}</p>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error bg-neutral"
              >
                Log Out
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
