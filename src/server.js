const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const config = require('./config');
const db = require('./db');

const itemRoutes = require('./routes/item.routes');
const authRoutes = require('./routes/auth.routes');

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
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Server running on port: ${config.port}`);
});
