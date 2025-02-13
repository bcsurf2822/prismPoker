import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import { rehydrateUser } from "../features/auth/authenticationSlice";

export default function RoomLayout() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(rehydrateUser());
  // }, [dispatch]);
  return (
    <main className="flex items-center justify-center min-h-screen ">
      <Outlet />
    </main>
  );
}
