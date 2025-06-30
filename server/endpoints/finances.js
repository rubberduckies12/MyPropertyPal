const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Helper to get landlordId from accountId
async function getLandlordId(pool, accountId) {
  const res = await pool.query(
    "SELECT id FROM landlord WHERE account_id = $1",
    [accountId]
  );
  if (res.rows.length === 0) throw new Error("No landlord found for this user");
  return res.rows[0].id;
}

router.get("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool"); // or however you access your pool
  try {
    const accountId = req.user.id;
    const landlordId = await getLandlordId(pool, accountId);

    // Rent payments (with property and tenant info)
    const rentPaymentsResult = await pool.query(`
      SELECT
        rp.id,
        rp.paid_on AS date,
        p.name AS property,
        a.first_name || ' ' || a.last_name AS tenant,
        rp.amount,
        'Received' AS status
      FROM rent_payment rp
      JOIN property p ON rp.property_id = p.id
      JOIN tenant t ON rp.tenant_id = t.id
      JOIN account a ON t.account_id = a.id
      WHERE p.landlord_id = $1
      ORDER BY rp.paid_on DESC
    `, [landlordId]);
    const rentPayments = rentPaymentsResult.rows;

    // Expenses
    const expensesResult = await pool.query(`
      SELECT
        id,
        incurred_on AS date,
        category,
        description,
        amount
      FROM expense
      WHERE landlord_id = $1
      ORDER BY incurred_on DESC
    `, [landlordId]);
    const expenses = expensesResult.rows;

    // Totals
    const totalIncome = rentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const taxableProfit = totalIncome - totalExpenses;

    res.json({
      rentPayments,
      expenses,
      totalIncome,
      totalExpenses,
      taxableProfit
    });
  } catch (err) {
    console.error("Error in /api/finances:", err);
    res.status(500).json({ error: "Failed to fetch finances" });
  }
});

module.exports = router;