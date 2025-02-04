const handlePlayerJoin = require("./room/joinGameSocket");
const handlePlayerLeave = require("./room/leaveGameSocket");

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    handlePlayerJoin(io, socket);
    handlePlayerLeave(io, socket);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSockets;
