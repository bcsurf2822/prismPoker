import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    socketService.connect();

    dispatch({ type: "websocket/listenToRoomEvents" });

    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    }

    const socket = socketService.getSocket();
    if (socket) {
      const handleConnect = () => {
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
