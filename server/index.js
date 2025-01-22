require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const setupSockets = require("./sockets");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your client's origin in production
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
app.use(cors());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

setupSockets(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
