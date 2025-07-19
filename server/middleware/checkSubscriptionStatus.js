// middleware/checkSubscriptionStatus.js
module.exports = async function checkSubscriptionStatus(req, res, next) {
    const pool = req.app.get("pool"); // <-- FIXED
    const landlordId = req.user.landlord_id;
    const { rows } = await pool.query(
        `SELECT status, is_active FROM subscription WHERE landlord_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [landlordId]
    );
    if (!rows.length || !rows[0].is_active || ['paused', 'past_due'].includes(rows[0].status)) {
        return res.status(403).json({ error: "Subscription inactive or payment overdue." });
    }
    next();
};