module.exports = function(app, pool) {
  app.get('/api/dashboard/user', async (req, res) => {
    // Replace with real user lookup (e.g., from session)
    const user = await pool.query('SELECT id, first_name, last_name, email FROM account LIMIT 1');
    res.json(user.rows[0]);
  });

  app.get('/api/dashboard/tenants/count', async (req, res) => {
    const result = await pool.query('SELECT COUNT(*) FROM tenant');
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

  app.get('/api/dashboard/properties', async (req, res) => {
    const result = await pool.query('SELECT * FROM property');
    res.json(result.rows);
  });
};