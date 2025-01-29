const generateGamesRoute = require("./generateGames");
const testRoute = require("./test");
const registerRoute = require("./register")
const loginRoute = require("./login")
const fetchGamesRoute = require("./fetchGames")
const addFundsRoute = require("./addFunds")
const userInfoRoute = require("./userInfo")
const fetchGameByIdRoute = require("./fetchGameById")

const setupRoutes = (app) => {
  app.use("/api/generateGames", generateGamesRoute);
  app.use("/api/test", testRoute);
  app.use("/api/register", registerRoute)
  app.use("/api/login", loginRoute)
  app.use("/api/games", fetchGamesRoute)
  app.use("/api/game/:gameId", fetchGameByIdRoute)
  app.use("/api/user/add-funds", addFundsRoute)
  app.use("/api/user/user-info", userInfoRoute)
};

module.exports = setupRoutes;
