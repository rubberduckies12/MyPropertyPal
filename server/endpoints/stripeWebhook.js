const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Use raw body for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const pool = req.app.get('pool'); // Use the database pool from the app
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the Stripe webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
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

        // Find the plan by Stripe price ID (if available)
        let planId = null;
        if (session.display_items && session.display_items[0]?.price?.id) {
          const priceId = session.display_items[0].price.id;
          const planResult = await pool.query(
            'SELECT id FROM payment_plan WHERE stripe_price_id = $1',
            [priceId]
          );
          if (planResult.rows.length > 0) {
            planId = planResult.rows[0].id;
          }
        }

        // Insert or update subscription record
        await pool.query(
          `INSERT INTO subscription (
            landlord_id, plan_id, stripe_subscription_id, stripe_customer_id, status, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, 'active', TRUE, NOW(), NOW())
          ON CONFLICT (landlord_id) DO UPDATE SET
            plan_id = $2,
            stripe_subscription_id = $3,
            stripe_customer_id = $4,
            status = 'active',
            is_active = TRUE,
            updated_at = NOW()`,
          [landlord_id, planId, stripeSubscriptionId, stripeCustomerId]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const subscriptionId = event.data.object.subscription;
        await pool.query(
          `UPDATE subscription
           SET status = 'past_due', is_active = FALSE, updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const billingCycleEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;

        await pool.query(
          `UPDATE subscription
           SET status = $1, billing_cycle_end = $2, updated_at = NOW()
           WHERE stripe_subscription_id = $3`,
          [subscription.status, billingCycleEnd, subscription.id]
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionId = event.data.object.id;
        await pool.query(
          `UPDATE subscription
           SET status = 'canceled', is_active = FALSE, deleted_at = NOW(), updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );
        break;
      }

      default: {
        console.log(`Unhandled event type ${event.type}`);
        // Log unhandled events to the database for later review
        await pool.query(
          `INSERT INTO unhandled_events (event_type, event_data, created_at)
           VALUES ($1, $2, NOW())`,
          [event.type, JSON.stringify(event.data)]
        );
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;