const jwt = require('jsonwebtoken');
const pool = require('../db'); // Adjust path if needed

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.AUTH_TOKEN_KEY, async (err, user) => {
      if (err) {
        console.log("JWT VERIFY ERROR:", err); // Debug log
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      // Fetch role from DB using account id (user.id)
      try {
        const roleRes = await pool.query(
          `SELECT r.role
             FROM account a
             JOIN account_role r ON a.role_id = r.id
            WHERE a.id = $1`,
          [user.id]
        );
        req.user = {
          id: user.id,
          role: roleRes.rows[0]?.role || null
        };
        next();
      } catch (dbErr) {
        console.error('Error fetching user role:', dbErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } catch (err) {
    console.error('Error in authentication middleware:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = authenticate;