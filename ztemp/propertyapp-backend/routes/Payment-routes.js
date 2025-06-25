const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Landlord sets rent (amount and due date) for a property
router.post('/set-rent', async (req, res) => {
  try {
    const { propertyId, tenantId, rentAmount, dueDate, billingAddress } = req.body;
    let property = await Property.findOne({ propertyId, landlordId: req.user.userId });

    if (!property) return res.status(404).json({ error: 'Property not found' });

    // Assign tenant if provided and not already set
    if (tenantId && !property.tenantId) {
      property.tenantId = tenantId;
      await property.save();
    }

    if (!property.tenantId) return res.status(400).json({ error: 'Property does not have a tenant assigned.' });

    property.monthlyRent = rentAmount;
    await property.save();

    const payment = new Payment({
      paymentId: uuidv4(),
      tenantId: property.tenantId,      // 6-digit userId
      landlordId: property.landlordId,  // 6-digit userId
      propertyId: property.propertyId,  // 6-digit propertyId
      amount: rentAmount,
      dueDate: new Date(dueDate),
      status: 'pending',
      billingAddress
    });
    await payment.save();
    res.status(201).json({ property, payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tenant initiates payment (early or on due date)
router.post('/pay', async (req, res) => {
  try {
    const { paymentId, tenantStripeCustomerId } = req.body;
    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Find landlord's Stripe account by 6-digit userId
    const landlord = await User.findOne({ userId: payment.landlordId });
    if (!landlord || !landlord.stripeAccountId) {
      return res.status(400).json({ error: 'Landlord not set up for Stripe payouts.' });
    }

    // Create a Stripe PaymentIntent for BACS Direct Debit
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Stripe expects pence
      currency: 'gbp',
      customer: tenantStripeCustomerId,
      payment_method_types: ['bacs_debit'],
      transfer_data: {
        destination: landlord.stripeAccountId
      },
      description: `Rent payment for property ${payment.propertyId}`,
      metadata: { paymentId: payment.paymentId }
    });

    // Update payment record with Stripe ID
    payment.stripeId = paymentIntent.id;
    payment.status = 'pending';
    await payment.save();

    res.json({ clientSecret: paymentIntent.client_secret, payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stripe webhook to confirm payment (mark as paid)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const payment = await Payment.findOne({ stripeId: paymentIntent.id });
    if (payment) {
      payment.status = 'paid';
      payment.paidDate = new Date();
      await payment.save();
    }
  }
  res.json({ received: true });
});

// Protect all routes below this line
router.use(auth);

// Get all payments for the authenticated landlord or tenant (by userId)
router.get('/', async (req, res) => {
  try {
    let payments = [];
    if (req.user.role === 'landlord') {
      payments = await Payment.find({ landlordId: req.user.userId });
    } else if (req.user.role === 'tenant') {
      payments = await Payment.find({ tenantId: req.user.userId });
    }
    res.json(payments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a payment by paymentId (not Mongo _id)
router.patch('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { paymentId: req.params.paymentId },
      req.body,
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a payment by paymentId (not Mongo _id)
router.delete('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ paymentId: req.params.paymentId });
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });
    res.json({ message: 'Payment deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;