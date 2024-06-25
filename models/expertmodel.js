const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now }
});

const chatschema =  new mongoose.Schema({
  name: { type: String, required: true },
  userid: { type: String, required: true },
  chatid:{ type: String, required: true }
})


const expertSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  password: { type: String, required: true },
  requests: [requestSchema] ,
  chats:[chatschema]// Embedding requestSchema inside expertSchema
});

const Experts = mongoose.models.Experts || mongoose.model('Experts', expertSchema);

module.exports = Experts;
