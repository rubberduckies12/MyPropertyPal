const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true, required: true },
  landlordId: String,
  tenantId: String,
  description: String,
  date: String,
  time: String,
  duration: String,
  status: { type: String, enum: ['pending', 'proposed', 'accepted'], default: 'pending' },
  proposedDate: String,
  proposedTime: String,
  proposedAt: Date,
  acceptedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);