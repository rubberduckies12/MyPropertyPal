const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.SANDBOX_STRIPE_SECRET_KEY);

// Use the shared pool from req.app.get("pool") in each route

// Stripe Connect onboarding for landlord
router.post('/onboard-landlord', async (req, res) => {
  const pool = req.app.get("pool");
  try {
    console.log("Stripe onboard payload:", req.body);
    const { email, landlordId } = req.body;
    if (!email || !landlordId) {
      return res.status(400).json({ error: "Missing email or landlordId" });
    }
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'GB',
      email,
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3001/reauth',
      return_url: 'http://localhost:3001/onboarded',
      type: 'account_onboarding',
    });
    await pool.query(
      'UPDATE landlord SET stripe_account_id = $1 WHERE id = $2',
      [account.id, landlordId]
    );
    res.json({ accountId: account.id, onboardingUrl: accountLink.url });
  } catch (err) {
    console.error("Stripe onboarding error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get tenant Stripe info
router.get('/tenant/:tenantId', async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { tenantId } = req.params;
    const result = await pool.query(
      'SELECT stripe_customer_id, stripe_payment_method_id FROM tenant WHERE id = $1',
      [tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create monthly subscription
router.post('/monthly-payment', async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { tenantId, landlordId, rentAmountInPence, dayOfMonth } = req.body;
    const tenantRes = await pool.query(
      'SELECT stripe_customer_id FROM tenant WHERE id = $1',
      [tenantId]
    );
    const landlordRes = await pool.query(
      'SELECT stripe_account_id FROM landlord WHERE id = $1',
      [landlordId]
    );
    const tenantStripeCustomerId = tenantRes.rows[0]?.stripe_customer_id;
    const landlordStripeAccountId = landlordRes.rows[0]?.stripe_account_id;
    if (!tenantStripeCustomerId || !landlordStripeAccountId) {
      return res.status(400).json({ error: 'Missing Stripe IDs' });
    }
    const price = await stripe.prices.create({
      unit_amount: rentAmountInPence,
      currency: 'gbp',
      recurring: { interval: 'month' },
      product_data: { name: 'Monthly Rent' },
    });
    const today = new Date();
    let anchorDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
    if (anchorDate < today) anchorDate.setMonth(anchorDate.getMonth() + 1);
    const subscription = await stripe.subscriptions.create({
      customer: tenantStripeCustomerId,
      items: [{ price: price.id }],
      billing_cycle_anchor: Math.floor(anchorDate.getTime() / 1000),
      transfer_data: { destination: landlordStripeAccountId },
      expand: ['latest_invoice.payment_intent'],
    });
    await pool.query(
      'UPDATE property_tenant SET stripe_subscription_id = $1 WHERE tenant_id = $2',
      [subscription.id, tenantId]
    );
    res.json({ subscription });
  } catch (err) {
    console.error("Monthly payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create one-off payment
router.post('/oneoff-payment', async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { tenantId, landlordId, rentAmountInPence } = req.body;
    const tenantRes = await pool.query(
      'SELECT stripe_customer_id FROM tenant WHERE id = $1',
      [tenantId]
    );
    const landlordRes = await pool.query(
      'SELECT stripe_account_id FROM landlord WHERE id = $1',
      [landlordId]
    );
    const tenantStripeCustomerId = tenantRes.rows[0]?.stripe_customer_id;
    const landlordStripeAccountId = landlordRes.rows[0]?.stripe_account_id;
    if (!tenantStripeCustomerId || !landlordStripeAccountId) {
      return res.status(400).json({ error: 'Missing Stripe IDs' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: rentAmountInPence,
      currency: 'gbp',
      customer: tenantStripeCustomerId,
      payment_method_types: ['card'],
      transfer_data: { destination: landlordStripeAccountId },
    });
    await pool.query(
      `INSERT INTO rent_payment (property_id, tenant_id, amount, paid_on, method, stripe_payment_intent_id)
       VALUES ($1, $2, $3, CURRENT_DATE, 'stripe', $4)`,
      [null, tenantId, rentAmountInPence / 100, paymentIntent.id]
    );
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("One-off payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create weekly subscription
router.post('/weekly-payment', async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { tenantId, landlordId, rentAmountInPence } = req.body;
    const tenantRes = await pool.query(
      'SELECT stripe_customer_id FROM tenant WHERE id = $1',
      [tenantId]
    );
    const landlordRes = await pool.query(
      'SELECT stripe_account_id FROM landlord WHERE id = $1',
      [landlordId]
    );
    const tenantStripeCustomerId = tenantRes.rows[0]?.stripe_customer_id;
    const landlordStripeAccountId = landlordRes.rows[0]?.stripe_account_id;
    if (!tenantStripeCustomerId || !landlordStripeAccountId) {
      return res.status(400).json({ error: 'Missing Stripe IDs' });
    }
    const price = await stripe.prices.create({
      unit_amount: rentAmountInPence,
      currency: 'gbp',
      recurring: { interval: 'week' },
      product_data: { name: 'Weekly Rent' },
    });
    const subscription = await stripe.subscriptions.create({
      customer: tenantStripeCustomerId,
      items: [{ price: price.id }],
      transfer_data: { destination: landlordStripeAccountId },
      expand: ['latest_invoice.payment_intent'],
    });
    await pool.query(
      'UPDATE property_tenant SET stripe_subscription_id = $1 WHERE tenant_id = $2',
      [subscription.id, tenantId]
    );
    res.json({ subscription });
  } catch (err) {
    console.error("Weekly payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;