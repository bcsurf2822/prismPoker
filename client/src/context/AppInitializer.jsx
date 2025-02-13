import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";
export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Always connect the socket
    socketService.connect();

    // Immediately subscribe to room events
    dispatch({ type: "websocket/listenToRoomEvents" });

    // If there's a token, subscribe to user events and rehydrate user state
    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    } else {
      console.log(
        "AppInitializer: No auth token, skipping user events subscription."
      );
    }

    // Listen for reconnection, and re-dispatch subscriptions on reconnect.
    const socket = socketService.getSocket();
    if (socket) {
      const handleConnect = () => {
        console.log(
          "AppInitializer: Socket reconnected. Re-subscribing to events."
        );
        dispatch({ type: "websocket/listenToRoomEvents" });
        if (token) {
          dispatch({ type: "websocket/listenToUserEvents" });
        }
      };

      socket.on("connect", handleConnect);

      return () => {
        socket.off("connect", handleConnect);
        dispatch({ type: "websocket/stopListeningToRoomEvents" });
        dispatch({ type: "websocket/stopListeningToUserEvents" });
      };
    }
  }, [dispatch, token]);

  return children;
}
