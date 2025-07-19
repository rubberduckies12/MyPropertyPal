const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Make sure to pass your database pool/connection to this file
// const pool = require('../db'); // Adjust path as needed

// Use raw body for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const pool = req.app.get("pool"); // <-- Use this to get your pool
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Set this in your .env from your Stripe dashboard
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;
      const email = session.customer_email;

      // Find the landlord/account by email
      const accountResult = await pool.query(
        'SELECT a.id AS account_id, l.id AS landlord_id FROM account a JOIN landlord l ON a.id = l.account_id WHERE a.email = $1',
        [email]
      );
      if (accountResult.rows.length === 0) {
        console.error('No landlord found for email:', email);
        break;
      }
      const { landlord_id } = accountResult.rows[0];

      // Find the plan by Stripe price ID (optional, if you store this mapping)
      // const planResult = await pool.query('SELECT id FROM payment_plan WHERE stripe_price_id = $1', [session.display_items[0].price.id]);
      // const plan_id = planResult.rows[0].id;

      // Insert or update subscription record
      await pool.query(
        `INSERT INTO subscription (
          landlord_id, plan_id, stripe_subscription_id, stripe_customer_id, status, is_active, created_at, updated_at
        ) VALUES ($1, NULL, $2, $3, 'active', TRUE, NOW(), NOW())
        ON CONFLICT (landlord_id) DO UPDATE SET
          stripe_subscription_id = $2,
          stripe_customer_id = $3,
          status = 'active',
          is_active = TRUE,
          updated_at = NOW()`,
        [landlord_id, stripeSubscriptionId, stripeCustomerId]
      );
      break;
    }
    case 'invoice.payment_failed': {
      const subscriptionId = event.data.object.subscription;
      await pool.query(
        `UPDATE subscription SET status = 'past_due', is_active = FALSE, updated_at = NOW() WHERE stripe_subscription_id = $1`,
        [subscriptionId]
      );
      break;
    }
    case 'customer.subscription.deleted': {
      const subscriptionId = event.data.object.id;
      await pool.query(
        `UPDATE subscription SET status = 'canceled', is_active = FALSE, deleted_at = NOW(), updated_at = NOW() WHERE stripe_subscription_id = $1`,
        [subscriptionId]
      );
      break;
    }
    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;