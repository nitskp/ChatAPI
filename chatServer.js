require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 7000;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('./routes/api/models/User')


mongoose.connect(
  "mongodb://localhost/UsersData",
  () => console.log("Database in Chat Server connected"),
  (err) => console.log(err)
);

let userID = "anonymous";

app.get("/", (req, res) => {
  const token = req.query.jwt;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Token didn't match",
      });
    } else {
      console.log("Decoded Data\n", "User : ", user);
      userID = user.userID;
    }
  });
  res.sendFile(path.join(__dirname, "public", "chatPage", "index.html"));
});

// ask about how to get request and use static simultaneously
// also see that sendFIle only send index.html. So all filepaths jumbles up and aren't pointing t
// to proper file. See how to rectify that
// app.use(express.static(path.join(__dirname,'public','chatPage')))

io.on("connection", (socket) => {
  socket.data.userName = userID;

  socket.broadcast.emit("new user", userID);

  socket.on("disconnect", () => {
    let userName = socket.data.userName;
    console.log("A user has disconnected");
    io.emit("user left", userName);
  });

  socket.on("chat message", async (msg) => {
    console.log("Message:", msg);
    const ans = await User.updateMany({userID:socket.data.userName}, {$push:{messages:{message:msg}}})
    console.log(ans)
    socket.broadcast.emit("chat message", socket.data.userName + " : " + msg);
  });
});

server.listen(PORT, () => {
  console.log(`Chat Page server on ${PORT} port`);
});
