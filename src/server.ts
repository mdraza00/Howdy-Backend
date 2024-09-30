import mongoose, { mongo } from "mongoose";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "node:http";
import app from "./app";

// Connecting to mongoDB database
(async function () {
  try {
    const connectionString = process.env.mondoDBAccessLink;
    if (connectionString)
      await mongoose.connect(connectionString).then(() => {
        console.log("Database has been connected successfully");
      });
  } catch (err) {
    console.log("There is some error in connecting with mongoDB database");
  }
})();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    socket.join(roomId);
  });
  socket.on("sent message", (data) => {
    io.to(data.roomId).emit("receieve message", data);
    io.to(data.roomId).emit("last message", data);
  });
  socket.on("messages-deleted-for-everyone", (data) => {
    io.to(data.roomId).emit("messages-deleted-for-everyone");
  });
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
