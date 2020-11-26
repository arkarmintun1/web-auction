const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const config = require('./config');
const db = require('./db');

const itemRoutes = require('./routes/item.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

db.loadDatabse();

const app = express();

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client', 'build')));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('new client connected: ', socket.id);

  // Test initial data
  socket.on('initial_data', () => {
    io.sockets.emit('get_data', 'hello_world');
  });

  // user disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Export socket to use in controllers
const socketIoObject = io;
module.exports.ioObject = socketIoObject;

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

server.listen(config.port, () => {
  console.log(`Server running on port: ${config.port}`);
});
