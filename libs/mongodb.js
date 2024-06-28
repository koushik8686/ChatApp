const mongoose = require('mongoose');
require('dotenv').config();


const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    const url = process.env.URL;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  }
};

module.exports = connectMongoDB;
