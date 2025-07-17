const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Update account settings (name, email, password)
router.put("/settings", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { firstName, lastName, email, password, plan } = req.body;
  const accountId = req.user.id;

  try {
    // Update name/email/password if provided
    if (firstName || lastName || email || password) {
      await pool.query(
        `UPDATE account
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             email = COALESCE($3, email),
             password = COALESCE($4, password)
         WHERE id = $5`,
        [firstName, lastName, email, password, accountId]
      );
    }

    // Update plan if provided and user is a landlord
    if (plan) {
      // Get payment_plan_id from plan name
      const planRes = await pool.query(
        "SELECT id FROM payment_plan WHERE name = $1",
        [plan]
      );
      if (planRes.rows.length === 0) {
        return res.status(400).json({ error: "Invalid plan" });
      }
      const paymentPlanId = planRes.rows[0].id;
      await pool.query(
        "UPDATE landlord SET payment_plan_id = $1 WHERE account_id = $2",
        [paymentPlanId, accountId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Account settings update error:", err);
    res.status(500).json({ error: "Failed to update account settings" });
  }
});

module.exports = router;