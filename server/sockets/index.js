const { allGamesSocket, gameSocket } = require("./game/gameSocket");
const joinSocket = require("./room/joinSocket");
const leaveSocket = require("./room/leaveSocket");
const roomSocket = require("./room/roomSocket");
const {
  updateCurrentPlayerSocket,
  endGameSocket,
} = require("./mech/mechSocket");
const {
  dealFlopSocket,
  dealTurnSocket,
  dealRiverSocket,
} = require("./dealer/dealerSocket");
const {
  playerBetSocket,
  callSocket,
  checkSocket,
  foldSocket,
} = require("./betting/betCheckFoldSocket");
const positionsAndBlindsSocket = require("./mech/newRoundSocket");
const { winningSocket } = require("./mech/winningSocket");

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    gameSocket(socket);
    allGamesSocket(socket);
    joinSocket(socket, io);
    leaveSocket(socket, io);
    roomSocket(socket);
    positionsAndBlindsSocket(socket, io);
    updateCurrentPlayerSocket(socket, io);
    endGameSocket(socket, io);
    dealFlopSocket(socket, io);
    dealTurnSocket(socket, io);
    dealRiverSocket(socket, io);
    callSocket(socket, io);
    checkSocket(socket, io);
    foldSocket(socket, io);
    playerBetSocket(socket, io);
    winningSocket(socket, io);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSockets;
