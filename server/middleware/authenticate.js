const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.AUTH_TOKEN_KEY, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      req.user = user;

      // Attach landlord_id if this is a landlord account
      const pool = req.app.get("pool");
      const result = await pool.query(
        'SELECT id FROM landlord WHERE account_id = $1',
        [user.id]
      );
      if (result.rows.length) {
        req.user.landlord_id = result.rows[0].id;
      }

      next();
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = authenticate;