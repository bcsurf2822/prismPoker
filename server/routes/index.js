const generateGamesRoute = require("./generateGames");
const testRoute = require("./test");

const setupRoutes = (app) => {
  app.use("/api/generateGames", generateGamesRoute);
  app.use("/api/test", testRoute);
};

module.exports = setupRoutes;
