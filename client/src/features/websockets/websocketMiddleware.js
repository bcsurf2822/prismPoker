import { updateGame } from "../games/gamesSlice";
import SocketService from "./socketService";

// Purpose:
// This middleware intercepts certain Redux actions to manage WebSocket connections and events globally from within your Redux store. It helps decouple WebSocket logic from UI components by handling it centrally.
// Role: Listens for Redux actions to manage WebSocket event subscriptions and dispatches Redux actions in response to socket events.

const websocketMiddleware = (store) => (next) => (action) => {
  const socket = SocketService.getSocket();

  if (!socket) return next(action);

  switch (action.type) {
    case "websocket/connect":
      SocketService.connect();
      socket.on("gameUpdated", (data) => {
        store.dispatch(updateGame(data));
      });
      break;

    case "websocket/listenToRoomEvents":
      // Game updates
      socket.on("gameUpdated", (updatedGame) => {
        store.dispatch(updateGame(updatedGame));
      });

      // Room-specific events
      socket.on("joinSuccess", (data) => {
        store.dispatch({ type: "room/joinSuccess", payload: data.game });
      });

      socket.on("joinError", (data) => {
        store.dispatch({ type: "room/joinError", payload: data.message });
      });

      socket.on("gameLeft", (data) => {
        store.dispatch({ type: "room/gameLeft", payload: data.game });
      });

      socket.on("leaveGameError", (data) => {
        store.dispatch({ type: "room/leaveError", payload: data.message });
      });
      break;

    case "websocket/stopListeningToRoomEvents":
      socket.off("gameUpdated");
      socket.off("joinSuccess");
      socket.off("joinError");
      socket.off("gameLeft");
      socket.off("leaveGameError");
      break;

    // case "websocket/listenToGames":
    //   socket.on("gameUpdated", (updatedGame) => {
    //     store.dispatch(updateGame(updatedGame));
    //   });
    //   break;

    // case "websocket/stopListeningToGames":
    //   socket.off("gameUpdated");
    //   break;

    case "websocket/disconnect":
      SocketService.disconnect();
      break;

    default:
      break;
  }

  return next(action);
};

export default websocketMiddleware;
