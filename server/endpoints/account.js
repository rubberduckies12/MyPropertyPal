const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); // Make sure this is at the top

// Update account settings (name, email, password)
router.put("/settings", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { firstName, lastName, email, password, plan } = req.body;
  const accountId = req.user.id;

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await pool.query(
      `UPDATE account
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             email = COALESCE($3, email),
             password = COALESCE($4, password)
         WHERE id = $5`,
      [firstName, lastName, email, hashedPassword, accountId]
    );

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

// Get current user info
router.get("/me", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const accountId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT first_name AS firstName, last_name AS lastName, email FROM account WHERE id = $1",
      [accountId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // If landlord, get plan
    const landlordRes = await pool.query(
      `SELECT p.name AS plan, s.status, s.is_active, s.canceled_at
       FROM subscription s
       JOIN payment_plan p ON s.plan_id = p.id
       WHERE s.landlord_id = (SELECT id FROM landlord WHERE account_id = $1)
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [accountId]
    );
    const plan = landlordRes.rows[0]?.plan || "basic";
    const subscriptionStatus = landlordRes.rows[0]?.status || "inactive";
    const isActive = landlordRes.rows[0]?.is_active || false;
    const canceledAt = landlordRes.rows[0]?.canceled_at || null;

    res.json({ ...result.rows[0], plan, subscriptionStatus, isActive, canceledAt });
  } catch (err) {
    console.error("Fetch account info error:", err);
    res.status(500).json({ error: "Failed to fetch account info" });
  }
});

// Forgot password: send reset email
router.post("/forgot-password", async (req, res) => {
  const pool = req.app.get("pool");
  const { email } = req.body;

  try {
    // Find user by email
    const result = await pool.query(
      "SELECT id FROM account WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No account with that email." });
    }
    const accountId = result.rows[0].id;

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min expiry

    // Save token and expiry to DB (add columns if needed)
    await pool.query(
      "UPDATE account SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
      [token, expires, accountId]
    );

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `https://my-property-pal-front.vercel.app/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
  const pool = req.app.get("pool");
  const { token, password } = req.body;

  try {
    // Find account by token and check expiry
    const result = await pool.query(
      "SELECT id, reset_token_expires FROM account WHERE reset_token = $1",
      [token]
    );
    if (
      result.rows.length === 0 ||
      new Date() > new Date(result.rows[0].reset_token_expires)
    ) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    const accountId = result.rows[0].id;

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token
    await pool.query(
      "UPDATE account SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, accountId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

module.exports = router;