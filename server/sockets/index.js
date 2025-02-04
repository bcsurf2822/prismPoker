

const handlePlayerJoin = require("./room/joinGameSocket")

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    handlePlayerJoin(io, socket)

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSockets;
