const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
});

usageSchema.index({ ip: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);