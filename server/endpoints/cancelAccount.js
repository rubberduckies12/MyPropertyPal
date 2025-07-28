const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// Cancel subscription endpoint
router.post("/cancel", async (req, res) => {
  const pool = req.app.get("pool"); // Retrieve the pool from the app instance
  const userId = req.user.id; // Assuming user ID is available from authentication middleware

  console.log("User ID:", userId);

  try {
    // Fetch the landlord ID for the user
    const landlordQuery = await pool.query(
      "SELECT id FROM landlord WHERE account_id = $1",
      [userId]
    );

    if (landlordQuery.rows.length === 0) {
      return res.status(404).json({ error: "Landlord not found." });
    }

    const landlordId = landlordQuery.rows[0].id;

    // Fetch the active subscription for the landlord
    const subscriptionQuery = await pool.query(
      "SELECT id, stripe_subscription_id FROM subscription WHERE landlord_id = $1 AND is_active = TRUE",
      [landlordId]
    );

    if (subscriptionQuery.rows.length === 0) {
      return res.status(404).json({ error: "No active subscription found to cancel." });
    }

    const { id: subscriptionId, stripe_subscription_id } = subscriptionQuery.rows[0];

    console.log("Canceling subscription with ID:", subscriptionId);
    console.log("Stripe Subscription ID:", stripe_subscription_id);

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
      subscriptionId,
    });
  } catch (err) {
    console.error("Error canceling subscription:", err);
    res.status(500).json({ error: "Failed to cancel subscription." });
  }
});

module.exports = router;