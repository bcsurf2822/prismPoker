import { Outlet } from "react-router";
import NavBar from "../components/generalUI/Navbar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </>
  );
}
