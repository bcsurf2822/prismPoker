import { createContext, useEffect, useState } from "react";
import SocketService from "../features/websockets/socketService";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect when the provider mounts
    SocketService.connect();
    const activeSocket = SocketService.getSocket();
    setSocket(activeSocket);

    // Cleanup on unmount
    return () => {
      SocketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
