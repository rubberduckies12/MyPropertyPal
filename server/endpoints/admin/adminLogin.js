const express = require("express");
const bcrypt = require("bcrypt");
const generateAdminAuthToken = require("../../assets/generateAdminAuthToken");

const router = express.Router();

router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const pool = req.app.get("pool"); // Get the pool from the app instance

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Query the admin_account table for the provided email
    const result = await pool.query(
      "SELECT id, email, password_hash, first_name, last_name FROM admin_account WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const admin = result.rows[0];

    // Compare the provided password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate admin token
    const token = await generateAdminAuthToken(admin.id);

    // Set the token in an HTTP-only cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return a success message and admin details (excluding sensitive data)
    return res.status(200).json({
      message: "Login successful.",
      admin: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
    });
  } catch (err) {
    console.error("Error during admin login:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;