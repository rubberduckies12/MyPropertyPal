const bcrypt = require('bcrypt');
const generateAuthToken = require('../assets/generateAuthToken');

async function login(req, res, pool) {
    try {
        const { email, password } = req.body || {};

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Normalize email
        const emailLowercase = email.toLowerCase();

        // Fetch user details
        const userQuery = {
            text: `
                SELECT
                    a.id,
                    a.password,
                    r.role
                FROM
                    account a
                JOIN
                    account_role r ON a.role_id = r.id
                WHERE
                    LOWER(a.email) = $1
            `,
            values: [emailLowercase],
        };

        const userResult = await pool.query(userQuery);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = await generateAuthToken(user.id);

        // Set JWT in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Return user role
        return res.status(200).json({ role: user.role });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = login;