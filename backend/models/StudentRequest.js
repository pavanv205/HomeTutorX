const mongoose = require('mongoose');

const StudentRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  queryType: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Contacted', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('StudentRequest', StudentRequestSchema);
