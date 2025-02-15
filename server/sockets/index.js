const handlePlayerJoin = require("./room/joinGameSocket");
const handlePlayerLeave = require("./room/leaveGameSocket");
const handleNewRound = require("./mech/newRoundSocket");
const handleDealToPlayers = require("./dealer/cardToPlayersSocket");
const handleDealFlop = require("./dealer/dealFlopSocket");
const handleDealTurn = require("./dealer/dealTurnSocket");
const handleDealRiver = require("./dealer/dealRiverSocket");
const handleBet = require("./betting/betSocket");
const handleCheck = require("./betting/checkSocket");
const handleFold = require("./betting/foldSocket");
const handleCall = require("./betting/callSocket");

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    handlePlayerJoin(io, socket);
    handlePlayerLeave(io, socket);
    handleNewRound(io, socket);
    handleDealToPlayers(io, socket);
    handleDealFlop(io, socket);
    handleDealTurn(io, socket);
    handleDealRiver(io, socket);
    handleBet(io, socket);
    handleCall(io, socket);
    handleCheck(io, socket);
    handleFold(io, socket);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = setupSockets;
