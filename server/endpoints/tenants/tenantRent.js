const express = require("express");
const router = express.Router();

// GET /api/tenant/rent
router.get("/", async (req, res) => {
  const pool = req.app.get("pool");
  const accountId = req.user.id;

  try {
    // Find the tenant ID for this account
    const tenantResult = await pool.query(
      "SELECT id FROM tenant WHERE account_id = $1",
      [accountId]
    );
    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ rent_amount: 0, rent_due_date: null });
    }
    const tenantId = tenantResult.rows[0].id;

    // Get the rent amount and due date for this tenant
    const rentResult = await pool.query(
      `SELECT rent_amount, rent_due_date
       FROM property_tenant
       WHERE tenant_id = $1
       ORDER BY id DESC LIMIT 1`,
      [tenantId]
    );
    if (rentResult.rows.length === 0) {
      return res.status(404).json({ rent_amount: 0, rent_due_date: null });
    }
    res.json(rentResult.rows[0]);
  } catch (err) {
    console.error("Error fetching tenant rent:", err);
    res.status(500).json({ rent_amount: 0, rent_due_date: null });
  }
});

module.exports = router;