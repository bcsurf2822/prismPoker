import { Outlet } from "react-router";

export default function RoomLayout() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-red-100">
      <Outlet />
    </main>
  );
}
