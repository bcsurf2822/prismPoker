import { updateGame } from "../games/gamesSlice";
import SocketService from "./socketService";

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

    case "websocket/disconnect":
      SocketService.disconnect();
      break;

    default:
      break;
  }

  return next(action);
};

export default websocketMiddleware;
