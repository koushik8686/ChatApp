const mongoose = require('mongoose');

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  }
};

module.exports = connectMongoDB;
