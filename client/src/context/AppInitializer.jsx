import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    socketService.connect();

    dispatch({ type: "websocket/listenToRoomEvents" });

    const localToken = localStorage.getItem("authToken");
    if (localToken) {
      console.log("[AppInitializer] Auth token found, rehydrating user.");
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    } else {
      console.log(
        "[AppInitializer] No auth token found, skipping rehydration."
      );
      dispatch(logout());
    }

    const socket = socketService.getSocket();
    if (socket) {
      const handleConnect = () => {
        dispatch({ type: "websocket/listenToRoomEvents" });
        const localToken = localStorage.getItem("authToken");
        if (localToken) {
          dispatch({ type: "websocket/listenToUserEvents" });
        } else {
          dispatch(logout());
        }
      };

      socket.on("connect", handleConnect);

      return () => {
        socket.off("connect", handleConnect);
        dispatch({ type: "websocket/stopListeningToRoomEvents" });
        dispatch({ type: "websocket/stopListeningToUserEvents" });
      };
    }
  }, [dispatch]);

  return children;
}
