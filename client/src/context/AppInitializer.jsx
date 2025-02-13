import {  useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateUser, updateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";


export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Always connect and listen for room events
    socketService.connect();
    dispatch({ type: "websocket/listenToRoomEvents" });
    
    // Check if a token exists
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    } else {
      console.log("AppInitializer: No auth token found, skipping user events subscription.");
    }

    // Optional cleanup when AppInitializer unmounts
    return () => {
      dispatch({ type: "websocket/stopListeningToRoomEvents" });
      dispatch({ type: "websocket/stopListeningToUserEvents" });
    };
  }, [dispatch]);

  return children;
}