const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // ===== Search Users =====
  router.get("/search-users", async (req, res) => {
    const { search = "" } = req.query; // Search term from the query string

    try {
      const query = `
        SELECT 
          l.account_id AS landlord_id, 
          a.first_name, 
          a.last_name, 
          a.email, 
          pp.name AS payment_plan_name
        FROM landlord l
        INNER JOIN account a ON l.account_id = a.id
        LEFT JOIN payment_plan pp ON l.payment_plan_id = pp.id
        WHERE LOWER(a.first_name) LIKE $1 
           OR LOWER(a.last_name) LIKE $1 
           OR LOWER(a.email) LIKE $1;
      `;

      const result = await pool.query(query, [`%${search.toLowerCase()}%`]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error searching for users:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};