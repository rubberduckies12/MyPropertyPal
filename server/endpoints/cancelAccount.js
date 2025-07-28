const express = require("express");
const router = express.Router();
const pool = require("../assets/databaseConnect"); // Database connection
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// Cancel subscription endpoint
router.post("/api/subscriptions/cancel", async (req, res) => {
  const { subscriptionId } = req.body; // Subscription ID from the request body
  const userId = req.user.id; // Assuming user ID is available from authentication middleware

  console.log("Canceling subscription with ID:", subscriptionId);
  console.log("User ID:", userId);

  try {
    // Check if the subscription belongs to the user and is active
    const subscription = await pool.query(
      "SELECT stripe_subscription_id FROM subscription WHERE id = $1 AND landlord_id = $2 AND is_active = TRUE",
      [subscriptionId, userId]
    );

    console.log("Subscription query result:", subscription.rows);

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found or already canceled." });
    }

    const { stripe_subscription_id } = subscription.rows[0];

    // Cancel the subscription immediately in Stripe
    const stripeResponse = await stripe.subscriptions.del(stripe_subscription_id, {
      invoice_now: false, // Do not generate a final invoice
      prorate: false, // Do not prorate charges
    });
    console.log("Stripe cancellation response:", stripeResponse);

    // Update the subscription in the database
    await pool.query(
      `UPDATE subscription
       SET status = 'canceled', is_active = FALSE, canceled_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [subscriptionId]
    );

    res.status(200).json({
      message: "Subscription canceled successfully.",
    });
  } catch (err) {
    console.error("Error canceling subscription:", err);
    res.status(500).json({ error: "Failed to cancel subscription." });
  }
});

module.exports = router;