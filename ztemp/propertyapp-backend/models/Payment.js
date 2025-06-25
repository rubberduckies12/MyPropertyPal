const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, required: true },
  tenantId: String,
  propertyId: String,
  amount: Number,
  dueDate: Date,
  paidDate: Date,
  status: String,
  stripeId: String,
  billingAddress: String // Added billing address field
});

module.exports = mongoose.model('Payment', PaymentSchema);

