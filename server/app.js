const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const rideRoutes = require('./routes/rides');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/rides', rideRoutes);

// WebSocket connection for real-time ride matching
io.on('connection', (socket) => {
  console.log('New client connected');

  // Emit ride updates
  socket.on('matchRequest', (data) => {
    // Here you could call your ride matching algorithm (e.g., Dijkstra's algorithm method)
    // and then emit a matching result.
    socket.broadcast.emit('rideMatched', { rideId: data.rideId, driver: "Sample Driver" });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});