const { app, server } = require("./socket.js")
const { dbConnection } =require("./db/dbConnection.js")
const express = require("express")
const cors = require("cors");
const bodyParser = require('body-parser');
const authRoutes = require("./routes/auth.js");
const messageRoutes = require("./routes/message.js");
const cookieParser = require("cookie-parser");


require("dotenv").config();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser())
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(3001, () => {
  dbConnection();
  console.log("SERVER IS RUNNING");
});
