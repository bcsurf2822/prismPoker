require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const setupSockets = require("./sockets");
const setupRoutes = require("./routes");

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.io = io;
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.static("public"));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// something to discuss on linked in what is this middleware, why was it working locally and not deployed without this.  DBL x env vars.  Look up other interesting toics and facts.  Enabling IP address on MongoDB.  What does credentials : true add.
// Handle preflight requests
app.options("*", cors());

mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

setupSockets(io);
setupRoutes(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
