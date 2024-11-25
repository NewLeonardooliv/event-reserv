const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 3002;

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('create-event', (data) => {
    try {
      console.log('Mensagem recebida do cliente:', data);

      io.emit('receive-event', data);
  } catch (error) {
      console.error('Erro ao processar os dados como JSON:', error.message);
  }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado.');
  });
});

app.get('/', (req, res) => {
  res.send('Servidor Socket.IO está rodando');
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});

