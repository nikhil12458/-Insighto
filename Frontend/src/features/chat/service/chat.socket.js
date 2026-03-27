import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
  if (socket) return socket;

  socket = io("https://insighto-d0of.onrender.com", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  return socket;
};

export const getSocket = () => socket;

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on("receiveMessage", callback);
  }
};

export const offReceiveMessage = (callback) => {
  if (socket) {
    socket.off("receiveMessage", callback);
  }
};
