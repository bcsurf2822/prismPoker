import { NavLink } from "react-router";

export default function Navbar() {
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
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
      </ul>
    </div>
  );
}
