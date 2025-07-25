const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
//const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = Stripe(process.env.SANDBOX_STRIPE_SECRET_KEY); // Use sandbox key

router.post('/create-checkout-session', async (req, res) => {
  const { plan_name, billing_cycle, email } = req.body;

  // Map plan and billing to Stripe Price ID
  let priceId;
  if (plan_name === 'basic' && billing_cycle === 'monthly') priceId = process.env.BASIC_MONTHLY_PRICE_ID;
  if (plan_name === 'basic' && billing_cycle === 'yearly') priceId = process.env.BASIC_YEARLY_PRICE_ID;
  if (plan_name === 'pro' && billing_cycle === 'monthly') priceId = process.env.PRO_MONTHLY_PRICE_ID;
  if (plan_name === 'pro' && billing_cycle === 'yearly') priceId = process.env.PRO_YEARLY_PRICE_ID;
  if (plan_name === 'organisation' && billing_cycle === 'monthly') priceId = process.env.ORG_MONTHLY_PRICE_ID;
  if (plan_name === 'organisation' && billing_cycle === 'yearly') priceId = process.env.ORG_YEARLY_PRICE_ID;

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan or billing cycle.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://app.mypropertypal.com/success?session_id={CHECKOUT_SESSION_ID}', // Updated URL
      cancel_url: 'https://app.mypropertypal.com/cancel', // Updated URL
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;