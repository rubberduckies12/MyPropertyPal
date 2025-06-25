const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // 6-digit code
  role: { type: String, enum: ['landlord', 'tenant'], required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  contact: String,
  linkedLandlordId: String, // userId of landlord (for tenants)
  verified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model('User', UserSchema);