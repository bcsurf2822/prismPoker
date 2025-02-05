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
        // Game state updates
        socket.on("gameUpdated", (updatedGame) => {
          console.log("gameUpdated event received:", updatedGame);
          store.dispatch(updateGame(updatedGame));
        });

        // Join/leave events that should ALSO update game state
        socket.on("joinSuccess", (data) => {
          console.log("joinSuccess event received:", data);
          store.dispatch(updateGame(data.game)); // Update Redux state
          store.dispatch({ type: "room/joinSuccess" }); // For UI feedback
        });

        socket.on("gameLeft", (data) => {
          console.log("gameLeft event received:", data);
          store.dispatch(updateGame(data.game)); // Update Redux state
          store.dispatch({ type: "room/gameLeft" }); // For UI feedback
        });

        // Error handling
        socket.on("joinError", (data) => {
          store.dispatch({ type: "room/joinError", payload: data.message });
        });

        socket.on("leaveGameError", (data) => {
          store.dispatch({ type: "room/leaveError", payload: data.message });
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
