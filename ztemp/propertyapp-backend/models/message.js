const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true },
  fromUserId: String,
  toUserId: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);

