const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, unique: true, required: true },
  tenantId: String,
  propertyId: String,
  fileUrl: String,
  type: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);

