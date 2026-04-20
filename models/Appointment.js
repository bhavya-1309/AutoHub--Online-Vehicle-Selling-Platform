const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  listing:  { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:     { type: Date, required: true },
  time:     { type: String, required: true },   // e.g. "10:30 AM"
  message:  { type: String },
  status:   { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
