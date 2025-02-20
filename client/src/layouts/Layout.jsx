import { Outlet } from "react-router";
import Navbar from "../components/generalUI/Navbar";
import Example from "../components/generalUI/NewNav";

export default function Layout() {
  return (
    <>
    <Example />
      {/* <Navbar /> */}
      <main className="flex items-center justify-center min-h-screen bg-blue-100">
        <Outlet />
      </main>
    </>
  );
}
