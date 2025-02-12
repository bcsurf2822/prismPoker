const handlePlayerJoin = require("./room/joinGameSocket");
const handlePlayerLeave = require("./room/leaveGameSocket");
const handleNewRound = require("./mech/newRoundSocket")
const handleDealToPlayers = require("./dealer/cardToPlayersSocket")

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    handlePlayerJoin(io, socket);
    handlePlayerLeave(io, socket);
    handleNewRound(io, socket);
    handleDealToPlayers(io, socket);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSockets;
