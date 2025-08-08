const bcrypt = require('bcrypt');
const generateAuthToken = require('../assets/generateAuthToken');

async function login(req, res, pool) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Convert email to lowercase
        const emailLowercase = email.toLowerCase();

        const query = {
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

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = await generateAuthToken(user.id);

        // Set JWT in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            //domain: '.mypropertypal.com', // <-- Enables cross-subdomain cookies
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // Return only the role (not the token)
        return res.status(200).json({ role: user.role });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = login;