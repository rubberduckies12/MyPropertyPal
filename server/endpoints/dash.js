const authenticateJWT = require('../middleware/jwt');

module.exports = function(app, pool) {
  // Get current user info
  app.get('/api/dashboard/user', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, first_name, last_name, email FROM account WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  });

  // Get tenant count for this landlord
  app.get('/api/dashboard/tenants/count', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    // Assuming landlord_id = userId
    const result = await pool.query(
      'SELECT COUNT(*) FROM tenant WHERE landlord_id = $1',
      [userId]
    );
    res.json({ count: Number(result.rows[0].count) });
  });
/*
  // Get messages for this landlord
  app.get('/api/dashboard/messages', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    // Example: SELECT * FROM messages WHERE landlord_id = $1
    const result = await pool.query(
      'SELECT * FROM messages WHERE landlord_id = $1',
      [userId]
    );
    res.json(result.rows);
  });

  // Get incidents for this landlord
  app.get('/api/dashboard/incidents', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    // Example: SELECT * FROM incidents WHERE landlord_id = $1
    const result = await pool.query(
      'SELECT * FROM incidents WHERE landlord_id = $1',
      [userId]
    );
    res.json(result.rows);
  });
*/
  // Get properties for this landlord
  app.get('/api/dashboard/properties', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM property WHERE landlord_id = $1',
      [userId]
    );
    res.json(result.rows);
  });
};