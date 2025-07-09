module.exports = function(app, pool) {
  const authenticate = require('../middleware/authenticate'); // adjust path if needed

  app.get('/api/dashboard/user', authenticate, async (req, res) => {
    const user = await pool.query('SELECT id, first_name, last_name, email FROM account WHERE id = $1', [req.user.id]);
    res.json(user.rows[0]);
  });

  app.get('/api/dashboard/tenants/count', authenticate, async (req, res) => {
    // Count tenants for properties owned by the logged-in landlord
    const result = await pool.query(
      `SELECT COUNT(DISTINCT t.id) AS count
       FROM tenant t
       JOIN property_tenant pt ON t.id = pt.tenant_id
       JOIN property p ON pt.property_id = p.id
       WHERE p.landlord_id = $1`,
      [req.user.id]
    );
    res.json({ count: Number(result.rows[0].count) });
  });

  app.get('/api/dashboard/messages', async (req, res) => {
    // Replace with your messages query
    res.json([]);
  });

  app.get('/api/dashboard/incidents', async (req, res) => {
    // Replace with your incidents query
    res.json([]);
  });

  app.get('/api/dashboard/properties', authenticate, async (req, res) => {
    // Only return properties for the logged-in landlord
    const result = await pool.query('SELECT * FROM property WHERE landlord_id = $1', [req.user.id]);
    res.json(result.rows);
  });
};