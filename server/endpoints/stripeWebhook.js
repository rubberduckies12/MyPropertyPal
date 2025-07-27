const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
//const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = Stripe(process.env.SANDBOX_STRIPE_SECRET_KEY); // Use sandbox key

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
        // Handle new subscription creation after checkout
        const session = event.data.object;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;
        const email = session.customer_email;

        console.log('Stripe Subscription ID:', stripeSubscriptionId);

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

        // Fetch line items to get the price ID
        let planId = null;
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const priceId = lineItems.data[0]?.price?.id;

          if (priceId) {
            const planResult = await pool.query(
              'SELECT id FROM payment_plan WHERE stripe_price_id = $1',
              [priceId]
            );
            if (planResult.rows.length > 0) {
              planId = planResult.rows[0].id;
            }
          }
        } catch (err) {
          console.error('Error fetching line items:', err);
        }

        // Fetch subscription details to get billing_cycle_end
        let billingCycleEnd = null;
        try {
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          billingCycleEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null;
        } catch (err) {
          console.error('Error fetching subscription details:', err);
        }

        // Insert or update subscription record in the database
        await pool.query(
          `INSERT INTO subscription (
            landlord_id, plan_id, stripe_subscription_id, stripe_customer_id, billing_cycle_end, status, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, 'active', TRUE, NOW(), NOW())
          ON CONFLICT (landlord_id) DO UPDATE SET
            plan_id = $2,
            stripe_subscription_id = $3,
            stripe_customer_id = $4,
            billing_cycle_end = $5,
            status = 'active',
            is_active = TRUE,
            updated_at = NOW()`,
          [landlord_id, planId, stripeSubscriptionId, stripeCustomerId, billingCycleEnd]
        );
        break;
      }

      case 'invoice.payment_failed': {
        // Handle payment failure for a subscription
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
        // Handle updates to a subscription (e.g., billing cycle changes)
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
        // Handle subscription cancellation
        const subscriptionId = event.data.object.id;

        // Update the subscription in the database to mark it as inactive
        await pool.query(
          `UPDATE subscription
           SET is_active = FALSE, deleted_at = NOW(), updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );
        break;
      }

      default: {
        // Log unhandled events for later review
        console.log(`Unhandled event type ${event.type}`);
        await pool.query(
          `INSERT INTO unhandled_events (event_type, event_data, created_at)
           VALUES ($1, $2, NOW())`,
          [event.type, JSON.stringify(event.data)]
        );
      }
    }

    // Respond to Stripe to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;