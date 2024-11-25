import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export let io: SocketIOServer | null = null;

export const initSocket = (server: NetServer) => {
  if (!io) {
    console.log("Initializing Socket.IO server...");
    io = new SocketIOServer(server, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

    });
  }
  return io;
};
