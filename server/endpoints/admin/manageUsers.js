const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // ===== 1. View All Users =====
  router.get("/all-users", async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 rows per page
    const offset = (page - 1) * limit;

    try {
      const query = `
        SELECT 
          a.id AS account_id, 
          a.first_name, 
          a.last_name, 
          a.email, 
          pp.name AS payment_plan_name
        FROM account a
        LEFT JOIN landlord l ON a.id = l.account_id
        LEFT JOIN payment_plan pp ON l.payment_plan_id = pp.id
        LIMIT $1 OFFSET $2;
      `;

      const result = await pool.query(query, [limit, offset]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== 2. Edit User Data =====
  router.put("/edit/:accountId", async (req, res) => {
    const { accountId } = req.params;
    const { firstName, lastName, email } = req.body;

    try {
      const updateQuery = `
        UPDATE account
        SET first_name = $1, last_name = $2, email = $3
        WHERE id = $4
        RETURNING id AS account_id, first_name, last_name, email;
      `;

      const result = await pool.query(updateQuery, [
        firstName,
        lastName,
        email,
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
        RETURNING id AS account_id, first_name, last_name, email;
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
        SELECT 
          a.id AS account_id, 
          a.first_name, 
          a.last_name, 
          a.email, 
          pp.name AS payment_plan_name
        FROM account a
        LEFT JOIN landlord l ON a.id = l.account_id
        LEFT JOIN payment_plan pp ON l.payment_plan_id = pp.id
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

  return router;
};