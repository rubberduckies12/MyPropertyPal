const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const router = express.Router();

// POST: Send reset password email
router.post("/send-email", async (req, res) => {
  const { email } = req.body;
  const pool = req.app.get("pool"); // <-- Get pool from app

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const result = await pool.query("SELECT id FROM account WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "If the email exists, a reset link has been sent." });
    }

    const userId = result.rows[0].id;

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Store the hashed token in the database with an expiration time
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour')",
      [userId, hashedToken]
    );

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `https://app.mypropertypal.com/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: `"MyPropertyPal" <hello@mypropertypal.com>`, // <-- Hardcoded alias
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>Thanks,<br>The MyPropertyPal Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "If the email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Error in sending reset email:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Reset password
router.post("/reset", async (req, res) => {
  const { token, newPassword } = req.body;
  const pool = req.app.get("pool"); // <-- Get pool from app

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await pool.query(
      "SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()",
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const userId = result.rows[0].user_id;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await pool.query("UPDATE account SET password = $1 WHERE id = $2", [hashedPassword, userId]);

    // Delete the used token
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId]);

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Error in resetting password:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;