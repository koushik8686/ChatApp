const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  expertname: { type: String, required: true },
  expertid: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now }
});

const chatschema =  new mongoose.Schema({
  expertname: { type: String, required: true },
  expertid: { type: String, required: true },
  chatid:{ type: String, required: true }
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  requests: [requestSchema],
  chats:[chatschema],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;



