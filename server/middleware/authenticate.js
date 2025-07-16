const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.AUTH_TOKEN_KEY, (err, user) => {
      if (err) {
        console.log("JWT VERIFY ERROR:", err); // Debug log
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.error('Error in authentication middleware:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = authenticate;