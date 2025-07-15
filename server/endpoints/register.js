const bcrypt = require('bcrypt');

// Helper to generate a random 6-digit number as a string
async function generateUniqueSixDigitId(pool) {
    let unique = false;
    let id;
    while (!unique) {
        id = Math.floor(100000 + Math.random() * 900000).toString();
        const result = await pool.query('SELECT 1 FROM account WHERE id = $1', [id]);
        if (result.rows.length === 0) unique = true;
    }
    return id;
}

module.exports = async function register(req, res, pool) {
    console.log("REGISTER BODY:", req.body);
    const { email, password, role, propertyId, firstName, lastName, invite } = req.body || {};

    if (invite) {
        // Invite-based registration (tenant)
        try {
            // Find tenant by invite token
            const tenantResult = await pool.query(
                `SELECT t.id, t.account_id FROM tenant t WHERE t.invite_token = $1 AND t.is_pending = TRUE`,
                [invite]
            );
            if (tenantResult.rows.length === 0) {
                return res.status(400).json({ error: "Invalid or expired invite." });
            }
            const { account_id } = tenantResult.rows[0];
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update account password, mark as not pending, clear invite_token
            await pool.query(
                `UPDATE account SET password = $1 WHERE id = $2`,
                [hashedPassword, account_id]
            );
            await pool.query(
                `UPDATE tenant SET is_pending = FALSE, invite_token = NULL WHERE id = $1`,
                [tenantResult.rows[0].id]
            );
            return res.status(200).json({ message: "Tenant registration complete." });
        } catch (err) {
            console.error('Error during invite registration:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Only landlords can self-register
    if (role !== "landlord") {
        return res.status(400).json({ error: "Tenants must register using an invite link." });
    }

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

        // Generate unique 6-digit user ID
        const userId = await generateUniqueSixDigitId(pool);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into account, now with first_name and last_name
        const accountResult = await pool.query(
            `INSERT INTO account (id, role_id, first_name, last_name, password, email, email_verified)
             VALUES ($1, $2, $3, $4, $5, $6, FALSE)
             RETURNING id, email, role_id, email_verified, first_name, last_name`,
            [userId, role_id, firstName, lastName, hashedPassword, email]
        );
        const accountId = accountResult.rows[0].id;

        // If tenant, insert into tenant table
        if (role === 'tenant') {
            await pool.query(
                `INSERT INTO tenant (account_id) VALUES ($1)`,
                [accountId]
            );
        }

        // If landlord, insert into landlord table with default payment_plan_id
        if (role === 'landlord') {
            await pool.query(
                `INSERT INTO landlord (account_id, payment_plan_id) VALUES ($1, $2)`,
                [accountId, 1] // Replace 1 with your actual default payment_plan_id
            );
        }

        return res.status(201).json(accountResult.rows[0]);
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};