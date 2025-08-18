const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const pool = req.app.get("pool"); // Get the database connection pool
  const { email, first_name, last_name } = req.body;

  // Validate input
  if (!email || !first_name || !last_name) {
    return res.status(400).json({ error: "Email, first name, and last name are required." });
  }

  try {
    // Insert the lead into the database
    const query = `
      INSERT INTO public.leads (email, first_name, last_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, first_name, last_name, created_at;
    `;
    const values = [email, first_name, last_name];
    const result = await pool.query(query, values);

    // Respond with the inserted lead
    res.status(201).json({
      message: "Lead added successfully.",
      lead: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting lead:", err);
    res.status(500).json({ error: "Failed to add lead." });
  }
});

module.exports = router;