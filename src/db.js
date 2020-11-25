const mongoose = require('mongoose');

const config = require('./config');

const loadDatabase = async () => {
  try {
    await mongoose.connect(
      config.mongoUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      () => {
        console.log('Database connected');
      }
    );
  } catch (error) {
    throw Error('Eror occurred while connecting database');
  }
};

module.exports = { loadDatabse: loadDatabase };
