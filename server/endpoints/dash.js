const express = require('express');
const router = express.Router();

module.exports = function(pool) {
  // Get user details
  router.get('/user', async (req, res) => {
    try {
      const user = await pool.query(
        'SELECT id, first_name, last_name, email FROM account WHERE id = $1',
        [req.user.id]
      );
      res.json(user.rows[0]);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      res.status(500).json({ error: "Failed to fetch user details." });
    }
  });

  // Count tenants for properties owned by the logged-in landlord
  router.get('/tenants/count', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT COUNT(DISTINCT t.id) AS count
         FROM tenant t
         JOIN property_tenant pt ON t.id = pt.tenant_id
         JOIN property p ON pt.property_id = p.id
         WHERE p.landlord_id = $1`,
        [req.user.id]
      );
      res.json({ count: Number(result.rows[0].count) });
    } catch (err) {
      console.error("Failed to fetch tenant count:", err);
      res.status(500).json({ error: "Failed to fetch tenant count." });
    }
  });

  // Count unread messages for the logged-in user
  router.get('/messages', async (req, res) => {
    try {
      const account_id = req.user.id;
      const result = await pool.query(
        `SELECT COUNT(*) AS unread_count
         FROM chat_message_status
         WHERE account_id = $1 AND is_read = FALSE`,
        [account_id]
      );
      res.json({ unread_count: Number(result.rows[0].unread_count) });
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
      res.status(500).json({ error: "Failed to fetch unread messages." });
    }
  });

  // Fetch incidents (placeholder)
  router.get('/incidents', async (req, res) => {
    res.json([]); // Replace with your incidents query
  });

  // Fetch properties for the logged-in landlord
  router.get('/properties', async (req, res) => {
    try {
      const landlordResult = await pool.query(
        'SELECT id FROM landlord WHERE account_id = $1',
        [req.user.id]
      );
      if (landlordResult.rows.length === 0) {
        return res.json([]); // No properties if not a landlord
      }
      const landlordId = landlordResult.rows[0].id;
      const result = await pool.query(
        'SELECT * FROM property WHERE landlord_id = $1',
        [landlordId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      res.status(500).json({ error: "Failed to fetch properties." });
    }
  });

  return router;
};