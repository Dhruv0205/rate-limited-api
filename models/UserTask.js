const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskCount: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserTask', userTaskSchema);
