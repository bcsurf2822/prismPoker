// Purpose:
// Acts as a singleton that manages your single Socket.IO connection. It encapsulates the logic for connecting to, retrieving, and disconnecting from your WebSocket server.

import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:4000", {
        transports: ["websocket"],
      });
// Recieving error after restart on server
//Error: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'id')
      this.socket.on("connect", () => {
        console.log("✅ WebSocket connected:", this.socket.id);
      });

      this.socket.on("disconnect", () => {
        console.log("❌ WebSocket disconnected");
        this.socket = null; 
      });
    }
  }

  getSocket() {
    if (!this.socket) {
      console.warn("⚠️ Socket is not initialized. Call connect() first.");
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
