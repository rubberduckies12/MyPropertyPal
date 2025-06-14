const bcrypt = require('bcrypt');

module.exports = async function register(req, res, pool) {
    const { email, password, role, landlordId, firstName, lastName } = req.body || {};

    if (!email || !password || !role || !firstName || !lastName) {
        return res.status(400).json({ error: 'Email, password, role, first name, and last name are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM account WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        // Get role_id from account_role table
        const roleResult = await pool.query(
            'SELECT id FROM account_role WHERE role = $1',
            [role]
        );
        if (roleResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid role.' });
        }
        const role_id = roleResult.rows[0].id;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into account, now with first_name and last_name
        const accountResult = await pool.query(
            `INSERT INTO account (role_id, first_name, last_name, password, email, email_verified)
             VALUES ($1, $2, $3, $4, $5, FALSE)
             RETURNING id, email, role_id, email_verified, first_name, last_name`,
            [role_id, firstName, lastName, hashedPassword, email]
        );
        const accountId = accountResult.rows[0].id;

        // If tenant, insert into tenant table
        if (role === 'tenant') {
            await pool.query(
                `INSERT INTO tenant (account_id) VALUES ($1)`,
                [accountId]
            );
        }

        // If landlord, you can add extra logic here later if needed

        return res.status(201).json(accountResult.rows[0]);
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};