const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.includes(' ')) {
        return res.status(401).json({error: 'Unauthorized: No token provided'});
    };

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Unauthorized: No token provided'});
    }

    jwt.verify(token, process.env.AUTH_TOKEN_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({error: 'Forbidden: Invalid token'});
        }

        req.user = user;
        next();
    });
    } catch(err) {
        console.error('Error in authentication middleware:', err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = authenticate;