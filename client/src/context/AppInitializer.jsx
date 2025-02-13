import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    socketService.connect();
    dispatch({ type: "websocket/listenToRoomEvents" });

    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    }

    return () => {
      dispatch({ type: "websocket/stopListeningToRoomEvents" });
      dispatch({ type: "websocket/stopListeningToUserEvents" });
    };
  }, [dispatch]);

  return children;
}
