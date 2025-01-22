export default function Navbar() {
  return (
    <div className="navbar bg-neutral text-neutral-content flex">
      <button className="btn btn-ghost text-xl">PKR Poker</button>
<ul className=" w-full flex justify-evenly">
  <li>
    <a href="/">Home</a>
  </li>
  <li>
    <a href="/">Games</a>
  </li>
  <li>
    <a href="/">Settings</a>
  </li>
</ul>
    </div>
  );
}
