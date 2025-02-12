import { Outlet } from "react-router";
import Navbar from "../components/generalUI/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { rehydrateUser } from "../features/auth/authenticationSlice";

export default function Layout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateUser());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-blue-100">
        <Outlet />
      </main>
    </>
  );
}