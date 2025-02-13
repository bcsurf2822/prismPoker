import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateUser } from "../features/auth/authenticationSlice";
import socketService from "../features/websockets/socketService";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // use Redux token

  useEffect(() => {
    socketService.connect();
    dispatch({ type: "websocket/listenToRoomEvents" });

    if (token) {
      dispatch(rehydrateUser());
      dispatch({ type: "websocket/listenToUserEvents" });
    } else {
      dispatch({ type: "websocket/stopListeningToUserEvents" });
      console.log(
        "AppInitializer: No auth token, stopping user events subscription."
      );
    }
  }, [dispatch, token]);

  return children;
}
