const bcrypt = require('bcrypt');
const generateAuthToken = require('../assets/generateAuthToken');

async function login(req, res, pool) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const query = {
            text: `
                SELECT
                    id,
                    password
                FROM
                    account
                WHERE
                    email = $1
            `,
            values: [email],
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

        return res.status(200).json({ token: token });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/*
async function login(req, res, pool) {
    // Get the info from the request body
    const {email, password} = req.body || {};

    // Check if any of the required fields are missing
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    try {
        const userQuery = {
            text: `SELECT * FROM account WHERE email = $1`,
            values: [email],
        };

        const result = await pool.query(userQuery);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Optionally, check if email is verified
        // if (!user.email_verified) {
        //     return res.status(403).json({ error: 'Email not verified' });
        // }

        // Return user info (never return password)
        return res.status(200).json({
            id: user.id,
            email: user.email,
            role_id: user.role_id,
            email_verified: user.email_verified
        });

    } catch(err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
*/

module.exports = login;