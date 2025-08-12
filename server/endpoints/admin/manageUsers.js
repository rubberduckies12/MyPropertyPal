const express = require("express");
const router = express.Router();

// Middleware to ensure only admins can access this endpoint
const authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

// Apply the admin authentication middleware
router.use(authenticateAdmin);

// Database pool
const pool = require("../../db"); // Adjust the path to your database connection file

// ===== 1. View All Data =====
router.get("/all", async (req, res) => {
  try {
    const accountsQuery = `
      SELECT a.id AS account_id, a.email, a.first_name, a.last_name, ar.role, a.email_verified,
             l.id AS landlord_id, l.payment_plan_id, pp.name AS payment_plan_name, pp.monthly_rate, pp.yearly_rate,
             t.id AS tenant_id, t.is_pending, t.stripe_customer_id,
             p.id AS property_id, p.address, p.city, p.postcode, pt.rent_amount, pt.rent_due_date
      FROM account a
      LEFT JOIN account_role ar ON a.role_id = ar.id
      LEFT JOIN landlord l ON a.id = l.account_id
      LEFT JOIN payment_plan pp ON l.payment_plan_id = pp.id
      LEFT JOIN tenant t ON a.id = t.account_id
      LEFT JOIN property_tenant pt ON t.id = pt.tenant_id
      LEFT JOIN property p ON pt.property_id = p.id;
    `;

    const result = await pool.query(accountsQuery);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching all user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== 2. Edit User Data =====
router.put("/edit/:accountId", async (req, res) => {
  const { accountId } = req.params;
  const { firstName, lastName, email, roleId } = req.body;

  try {
    const updateQuery = `
      UPDATE account
      SET first_name = $1, last_name = $2, email = $3, role_id = $4
      WHERE id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      firstName,
      lastName,
      email,
      roleId,
      accountId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.status(200).json({ message: "Account updated successfully.", account: result.rows[0] });
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== 3. Delete User Data =====
router.delete("/delete/:accountId", async (req, res) => {
  const { accountId } = req.params;

  try {
    const deleteQuery = `
      DELETE FROM account
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(deleteQuery, [accountId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.status(200).json({ message: "Account deleted successfully.", account: result.rows[0] });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== 4. View Specific User Details =====
router.get("/details/:accountId", async (req, res) => {
  const { accountId } = req.params;

  try {
    const userDetailsQuery = `
      SELECT a.id AS account_id, a.email, a.first_name, a.last_name, ar.role, a.email_verified,
             l.id AS landlord_id, l.payment_plan_id, pp.name AS payment_plan_name, pp.monthly_rate, pp.yearly_rate,
             t.id AS tenant_id, t.is_pending, t.stripe_customer_id,
             p.id AS property_id, p.address, p.city, p.postcode, pt.rent_amount, pt.rent_due_date
      FROM account a
      LEFT JOIN account_role ar ON a.role_id = ar.id
      LEFT JOIN landlord l ON a.id = l.account_id
      LEFT JOIN payment_plan pp ON l.payment_plan_id = pp.id
      LEFT JOIN tenant t ON a.id = t.account_id
      LEFT JOIN property_tenant pt ON t.id = pt.tenant_id
      LEFT JOIN property p ON pt.property_id = p.id
      WHERE a.id = $1;
    `;

    const result = await pool.query(userDetailsQuery, [accountId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;