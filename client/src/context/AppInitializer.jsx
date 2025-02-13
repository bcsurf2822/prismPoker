import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Always connect and subscribe to room events (game stats, etc.)
    socketService.connect();
    dispatch({ type: "websocket/listenToRoomEvents" });

    // Check if a token exists; if so, rehydrate user and subscribe to user events.
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    } else {
      console.log(
        "AppInitializer: No auth token found, skipping user events subscription."
      );
    }

    // Cleanup: Unsubscribe when AppInitializer unmounts (if ever)
    return () => {
      dispatch({ type: "websocket/stopListeningToRoomEvents" });
      dispatch({ type: "websocket/stopListeningToUserEvents" });
    };
  }, [dispatch]);

  return children;
}
