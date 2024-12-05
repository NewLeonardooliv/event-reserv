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
let MAX_ACTIVE_USERS = 1;
let INTERACTION_TIMEOUT = 30000; // 30 seconds

let users = [];
let onlineUsers = [];
let activeUsers = [];

const moveToEndOfQueue = (userId) => {
  const userIndex = activeUsers.indexOf(userId);
  if (userIndex !== -1) {
    activeUsers.splice(userIndex, 1);
    const user = users.find((u) => u.id === userId);
    if (user) {
      users = users.filter((u) => u.id !== userId);
      users.push(user);
    }
    checkAndActivateNextUser();
  }
};

const checkAndActivateNextUser = () => {
  while (
    activeUsers.length < MAX_ACTIVE_USERS &&
    users.length > activeUsers.length
  ) {
    const nextUserId = users.find((user) => !activeUsers.includes(user.id))?.id;
    if (nextUserId) {
      activeUsers.push(nextUserId);
      io.to(nextUserId).emit("activateUser", {
        timeLimit: INTERACTION_TIMEOUT,
      });

      setTimeout(() => moveToEndOfQueue(nextUserId), INTERACTION_TIMEOUT);
    }
  }
  io.emit("updateActiveUsers", activeUsers);
  io.emit("updateUsers", users);
};

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  const updateClientData = () => {
    socket.emit("updateUsers", users);
    socket.emit("updateActiveUsers", activeUsers);
    socket.emit("updateOnlineUsers", onlineUsers);
  };

  socket.on("getInitialData", updateClientData);

  socket.on("connectClient", () => {
    const newUser = { id: socket.id, name: `User ${socket.id}` };
    onlineUsers.push(newUser);
    io.emit("updateOnlineUsers", onlineUsers);
  });

  socket.on("joinQueue", (userData) => {
    const newUser = {
      id: socket.id,
      name: userData.name || `User ${socket.id.substr(0, 4)}`,
    };
    users.push(newUser);
    io.emit("updateUsers", users);
    checkAndActivateNextUser();
  });

  socket.on("leaveQueue", () => {
    users = users.filter((user) => user.id !== socket.id);
    const activeIndex = activeUsers.indexOf(socket.id);
    if (activeIndex !== -1) activeUsers.splice(activeIndex, 1);
    io.emit("updateUsers", users);
    io.emit("updateActiveUsers", activeUsers);
    checkAndActivateNextUser();
  });

  socket.on("finishInteraction", () => moveToEndOfQueue(socket.id));

  socket.on("setConfig", (data) => {
    console.log(data);
    MAX_ACTIVE_USERS = data.maxUsers;
    INTERACTION_TIMEOUT = data.choiceTime * 1000;
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    users = users.filter((user) => user.id !== socket.id);
    const activeIndex = activeUsers.indexOf(socket.id);
    if (activeIndex !== -1) activeUsers.splice(activeIndex, 1);
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit("updateOnlineUsers", onlineUsers);
    io.emit("updateUsers", users);
    io.emit("updateActiveUsers", activeUsers);
    checkAndActivateNextUser();
  });

  const handleEvent = (eventType, data) => {
    try {
      console.log(`${eventType} evento:`, data);
      io.emit(`receive-${eventType}`, {
        ...data,
        createdAt: new Date(),
        createdBy: socket.id,
      });
    } catch (error) {
      console.error(`Erro ao processar ${eventType} evento:`, error);
      socket.emit("error", {
        message: `Erro ao processar ${eventType} evento`,
        details: error.message,
      });
    }
  };

  socket.on("patch-event", (data) => handleEvent("event-att", data));
  socket.on("create-event", (data) => handleEvent("event", data));
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
