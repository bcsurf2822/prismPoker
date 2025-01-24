const generateGamesRoute = require("./generateGames");
const testRoute = require("./test");
const registerRoute = require("./register")
const loginRoute = require("./login")
const fetchGamesRoute = require("./fetchGames")

const setupRoutes = (app) => {
  app.use("/api/generateGames", generateGamesRoute);
  app.use("/api/test", testRoute);
  app.use("/api/register", registerRoute)
  app.use("/api/login", loginRoute)
  app.use("/api/games", fetchGamesRoute)
};

module.exports = setupRoutes;
