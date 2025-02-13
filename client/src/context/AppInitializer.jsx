import {  useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateUser, updateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";


export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate the user immediately.
    dispatch(rehydrateUser());

    // Connect the socket.
    socketService.connect();

    // Wait for the socket to connect before subscribing.
    const socket = socketService.getSocket();
    if (socket) {
      // Use the "connect" event to ensure that the socket is ready.
      socket.on("connect", () => {
        console.log("AppInitializer: Socket connected. Subscribing to userUpdated events.");
        socket.on("userUpdated", handleUserUpdated);
      });
    }

    // Handler function.
    const handleUserUpdated = (userData) => {
      console.log("AppInitializer: userUpdated event received:", userData);
      dispatch(updateUser(userData));
    };

    // Cleanup: Unsubscribe from events when AppInitializer unmounts.
    return () => {
      const socket = socketService.getSocket();
      if (socket) {
        socket.off("userUpdated", handleUserUpdated);
        console.log("AppInitializer: Unsubscribed from userUpdated events.");
      }
    };
  }, [dispatch]);

  return children;
}