// middleware/checkSubscriptionStatus.js
module.exports = async function checkSubscriptionStatus(req, res, next) {
    const pool = req.app.get("pool");

    // Exclude specific routes from subscription checks
    const excludedRoutes = ['/register', '/login', '/api/tenants/invite/:token', '/webhook'];
    if (excludedRoutes.some(route => req.path.startsWith(route))) {
        return next(); // Skip subscription check for excluded routes
    }

    const landlordId = req.user.landlord_id;
    if (!landlordId) {
        // Not a landlord, skip subscription check
        return next();
    }

    const { rows } = await pool.query(
        `SELECT status, is_active FROM subscription WHERE landlord_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [landlordId]
    );

    if (!rows.length || !rows[0].is_active || ['paused', 'past_due'].includes(rows[0].status)) {
        return res.status(403).json({ error: "Subscription inactive or payment overdue." });
    }

    next();
};