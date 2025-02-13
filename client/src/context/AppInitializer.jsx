import {  useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateUser, updateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";


export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // If a token exists, rehydrate the user and connect the socket.
      dispatch(rehydrateUser());
      socketService.connect();
    } else {
      console.log("AppInitializer: No auth token found, skipping rehydration and socket connection.");
    }

    const socket = socketService.getSocket();
    if (socket) {
      const handleUserUpdated = (userData) => {
        // Before processing any update, check if the token is still present.
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("AppInitializer: No auth token found, ignoring userUpdated event.");
          return;
        }
        console.log("AppInitializer: userUpdated event received:", userData);
        dispatch(updateUser(userData));
      };

      // Subscribe to user events.
      socket.on("userUpdated", handleUserUpdated);
      console.log("AppInitializer: Subscribed to userUpdated events.");

      // Cleanup: Unsubscribe when unmounting.
      return () => {
        socket.off("userUpdated", handleUserUpdated);
        console.log("AppInitializer: Unsubscribed from userUpdated events.");
      };
    }
  }, [dispatch]);

  return children;
}