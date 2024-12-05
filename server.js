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

let users = [];
let activeUsers = [];
const MAX_ACTIVE_USERS = 1;
const INTERACTION_TIMEOUT = 30000; // 30 seconds

function moveToEndOfQueue(userId) {
  const userIndex = activeUsers.indexOf(userId);
  if (userIndex !== -1) {
    activeUsers.splice(userIndex, 1);
    const user = users.find(u => u.id === userId);
    if (user) {
      users = users.filter(u => u.id !== userId);
      users.push(user);
    }
    checkAndActivateNextUser();
  }
}

function checkAndActivateNextUser() {
  while (activeUsers.length < MAX_ACTIVE_USERS && users.length > activeUsers.length) {
    const nextUserId = users.find(user => !activeUsers.includes(user.id))?.id;
    if (nextUserId) {
      activeUsers.push(nextUserId);
      io.to(nextUserId).emit('activateUser', { timeLimit: INTERACTION_TIMEOUT });
      
      setTimeout(() => moveToEndOfQueue(nextUserId), INTERACTION_TIMEOUT);
    }
  }
  io.emit("updateActiveUsers", activeUsers);
  io.emit("updateUsers", users);
}

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("getInitialData", () => {
    socket.emit("updateUsers", users);
    socket.emit("updateActiveUsers", activeUsers);
  });

  socket.on("joinQueue", (userData) => {
    const newUser = { 
      id: socket.id, 
      name: userData.name || `User ${socket.id.substr(0, 4)}` 
    };
    users.push(newUser);
    io.emit("updateUsers", users);
    checkAndActivateNextUser();
  });

  socket.on("leaveQueue", () => {
    users = users.filter(user => user.id !== socket.id);
    const activeIndex = activeUsers.indexOf(socket.id);
    if (activeIndex !== -1) {
      activeUsers.splice(activeIndex, 1);
    }
    io.emit("updateUsers", users);
    io.emit("updateActiveUsers", activeUsers);
    checkAndActivateNextUser();
  });

  socket.on("finishInteraction", () => {
    moveToEndOfQueue(socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    users = users.filter(user => user.id !== socket.id);
    const activeIndex = activeUsers.indexOf(socket.id);
    if (activeIndex !== -1) {
      activeUsers.splice(activeIndex, 1);
    }
    io.emit("updateUsers", users);
    io.emit("updateActiveUsers", activeUsers);
    checkAndActivateNextUser();
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    users: users.length,
    activeUsers: activeUsers.length,
  });
});

server.on("error", (error) => {
  console.error("Erro no servidor:", error);
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});