const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
});

const PORT = 3002;

let onlineUsers = [];
let waitingList = [];

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  const newUser = { id: socket.id, name: `User ${socket.id.substr(0, 4)}` };
  onlineUsers.push(newUser);

  io.emit("updateOnlineUsers", onlineUsers);

  socket.on("getInitialData", () => {
    socket.emit("updateOnlineUsers", onlineUsers);
    socket.emit("updateWaitingList", waitingList);
  });

  socket.on("create-event", (data) => {
    try {
      console.log("Novo evento criado:", data);

      io.emit("receive-event", {
        ...data,
        createdAt: new Date(),
        createdBy: socket.id,
      });
    } catch (error) {
      console.error("Erro ao processar evento:", error);
      socket.emit("error", {
        message: "Erro ao criar evento",
        details: error.message,
      });
    }
  });

  socket.on("joinQueue", (userData) => {
    try {
      const userIndex = waitingList.findIndex((user) => user.id === socket.id);

      if (userIndex === -1) {
        const user = {
          id: socket.id,
          name: userData.name || `User ${socket.id.substr(0, 4)}`,
        };
        waitingList.push(user);

        io.emit("updateWaitingList", waitingList);
      }
    } catch (error) {
      console.error("Erro ao entrar na fila:", error);
      socket.emit("error", {
        message: "Erro ao entrar na fila",
        details: error.message,
      });
    }
  });

  socket.on("leaveQueue", () => {
    try {
      waitingList = waitingList.filter((user) => user.id !== socket.id);

      io.emit("updateWaitingList", waitingList);
    } catch (error) {
      console.error("Erro ao sair da fila:", error);
      socket.emit("error", {
        message: "Erro ao sair da fila",
        details: error.message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);

    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);

    waitingList = waitingList.filter((user) => user.id !== socket.id);

    io.emit("updateOnlineUsers", onlineUsers);
    io.emit("updateWaitingList", waitingList);
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    onlineUsers: onlineUsers.length,
    waitingList: waitingList.length,
  });
});

server.on("error", (error) => {
  console.error("Erro no servidor:", error);
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
