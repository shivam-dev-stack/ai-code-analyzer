const mongoose = require('mongoose');

const codeHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ['analyze'], default: 'analyze' },
  prompt: { type: String, required: true, trim: true, maxlength: 500 },
  code: { type: String, maxlength: 4000 },
  response: { type: String, required: true },
  language: String,
  createdAt: { type: Date, default: Date.now, expires: '14d' }
});

codeHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('CodeHistory', codeHistorySchema);