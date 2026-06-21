const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);
