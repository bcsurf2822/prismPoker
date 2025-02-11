import { updateGame } from "../games/gamesSlice";
import SocketService from "./socketService";

// Purpose:
// This middleware intercepts certain Redux actions to manage WebSocket connections and events globally from within your Redux store. It helps decouple WebSocket logic from UI components by handling it centrally.
// Role: Listens for Redux actions to manage WebSocket event subscriptions and dispatches Redux actions in response to socket events.

let isSubscribedToRoom = false;

const websocketMiddleware = (store) => (next) => (action) => {
  const socket = SocketService.getSocket();

  if (!socket) return next(action);

  switch (action.type) {
    case "websocket/connect":
      SocketService.connect();
      break;

    case "websocket/listenToRoomEvents":
      if (!isSubscribedToRoom) {
        socket.on("gameUpdated", (updatedGame) => {
          console.log("gameUpdated event received:", updatedGame);
          store.dispatch(updateGame(updatedGame));
        });
        socket.on("joinSuccess", (data) => {
          store.dispatch(updateGame(data.game));
          store.dispatch({ type: "games/joinSuccess" });
        });

        socket.on("gameLeft", (data) => {
          store.dispatch(updateGame(data.game));
          store.dispatch({ type: "games/gameLeft" });
        });

        socket.on("joinError", (data) => {
          store.dispatch({ type: "games/joinError", payload: data.message });
        });

        socket.on("leaveGameError", (data) => {
          store.dispatch({ type: "games/leaveError", payload: data.message });
        });

        socket.on("gameError", (data) => {
          store.dispatch({ type: "games/gameError", payload: data.message });
        });


        isSubscribedToRoom = true;
        console.log("Subscribed to room events");
      }
      break;

    case "websocket/stopListeningToRoomEvents":
      if (isSubscribedToRoom) {
        socket.off("gameUpdated");
        socket.off("joinSuccess");
        socket.off("joinError");
        socket.off("gameError");
        socket.off("gameLeft");
        socket.off("leaveGameError");
        isSubscribedToRoom = false;
        console.log("Unsubscribed from room events");
      }
      break;

    case "websocket/disconnect":
      SocketService.disconnect();
      break;

    default:
      break;
  }

  return next(action);
};

export default websocketMiddleware;
