const mongoose = require('mongoose');


const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, unique: true, required: true },
  tenantId: String,
  propertyId: String,
  description: String,
  severity: { type: String, enum: ['red', 'yellow', 'green'] },
  status: String,
  createdAt: { type: Date, default: Date.now },
  tenantConfirmedClosed: { type: Boolean, default: false },
  landlordConfirmedClosed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Incident', IncidentSchema);

