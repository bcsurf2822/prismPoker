const generateGamesRoute = require("./generateGames");
const testRoute = require("./test");
const registerRoute = require("./userRegistration")

const setupRoutes = (app) => {
  app.use("/api/generateGames", generateGamesRoute);
  app.use("/api/test", testRoute);
  app.use("/api/register", registerRoute)
};

module.exports = setupRoutes;
