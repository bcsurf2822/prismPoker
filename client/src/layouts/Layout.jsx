import { Outlet } from "react-router";
import Navbar from "../components/generalUI/Navbar";


export default function Layout() {


  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-blue-100">
        <Outlet />
      </main>
    </>
  );
}