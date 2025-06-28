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



module.exports = login;