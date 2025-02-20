import { createContext, useEffect, useState } from "react";
import SocketService from "../features/websockets/socketService";
import PropTypes from "prop-types";

// Manages the WebSocket connection lifecycle (connect/disconnect) and provides access to the socket instance.
// - Uses socket.io-client to establish a WebSocket connection.
// -Exposes connect(), disconnect(), and getSocket() methods.

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    SocketService.connect();
    const activeSocket = SocketService.getSocket();
    setSocket(activeSocket);

    return () => {
      SocketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
