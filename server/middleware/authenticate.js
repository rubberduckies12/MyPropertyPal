const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
  try {
    console.log(`Authenticate middleware called for route: ${req.path}`);

    // Exclude public routes and /webhook
    const excludedRoutes = ['/register', '/login', '/api/tenants/invite/:token', '/webhook'];
    if (excludedRoutes.some(route => req.originalUrl.startsWith(route))) {
      return next(); // Skip authentication for excluded routes
    }

    const token = req.cookies.token; // Read JWT from cookie
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

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
    console.error('Error in authenticate middleware:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = authenticate;