const express = require("express");
const router = express.Router();

router.get("/approve/:token", async (req, res) => {
  const { token } = req.params;
  const pool = req.app.get("pool"); // Get the pool from the app instance

  try {
    // Check if the token exists
    const result = await pool.query(
      "SELECT id FROM admin_account WHERE approval_token = $1 AND is_approved = false",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid or expired approval token." });
    }

    const adminId = result.rows[0].id;

    // Approve the admin
    await pool.query(
      "UPDATE admin_account SET is_approved = true, approval_token = NULL WHERE id = $1",
      [adminId]
    );

    return res.status(200).json({ message: "Admin approved successfully." });
  } catch (err) {
    console.error("Error during admin approval:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;