const express = require("express");
const router = express.Router();
const pool = require("../assets/databaseConnect"); // Database connection
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// Cancel subscription endpoint
router.post("/subscriptions/:id/cancel", async (req, res) => {
  const { id } = req.params; // Subscription ID
  const userId = req.user.id; // Assuming user ID is available from authentication middleware

  try {
    // Check if the subscription belongs to the user and is active
    const subscription = await pool.query(
      "SELECT stripe_subscription_id, billing_cycle_end FROM subscription WHERE id = $1 AND landlord_id = $2 AND is_active = TRUE",
      [id, userId]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found or already canceled." });
    }

    const { stripe_subscription_id, billing_cycle_end } = subscription.rows[0];

    // Cancel the subscription immediately in Stripe
    await stripe.subscriptions.del(stripe_subscription_id, {
      invoice_now: false, // Do not generate a final invoice
      prorate: false, // Do not prorate charges
    });

    // Update the subscription in the database
    await pool.query(
      `UPDATE subscription
       SET status = 'canceled', is_active = TRUE, canceled_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      message: "Subscription canceled. Access will remain active until the end of the billing cycle.",
      billingCycleEnd: billing_cycle_end,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel subscription." });
  }
});

module.exports = router;