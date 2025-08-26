import { Server } from "socket.io";
import http from "http";
import express from "express";
// import { useEffect } from "react";
// import { io } from "socket.io-client";

const app = express();
const server = http.createServer(app);
// const socket = io("http://localhost:5001", { query: { userId: currentUser._id } });
const io = new Server(server, {
  cors: {

    // origin: ["http://localhost:5173"],
    origin : "*"

  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// useEffect(() => {
//   socket.on("messageDeleted", (deletedMessageId) => {
//     setMessages(prevMessages => prevMessages.filter(msg => msg._id !== deletedMessageId));
//   });

//   return () => {
//     socket.off("messageDeleted");
//   };
// }, []);
export { io, app, server };
