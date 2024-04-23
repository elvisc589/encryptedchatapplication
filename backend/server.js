const authRoutes = require("./routes/auth.js");
const messageRoutes = require("./routes/message.js");
const { dbConnection } = require("./db/dbConnection.js");
const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const CryptoJS = require("crypto-js")
const cookieParser  = require("cookie-parser")

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json()); // to parse the incoming request with JSON payloads

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    
  });
});

server.listen(3001, () => {
  dbConnection();
  console.log("SERVER IS RUNNING");
});

