const bcrypt = require('bcrypt');
const generateAuthToken = require('../assets/generateAuthToken');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

        // Check if the user has an active subscription
        const subscriptionQuery = {
            text: `
                SELECT
                    s.is_active,
                    s.plan_id
                FROM
                    subscription s
                WHERE
                    s.landlord_id = $1
                LIMIT 1
            `,
            values: [user.id],
        };

        const subscriptionResult = await pool.query(subscriptionQuery);

        if (subscriptionResult.rows.length === 0) {
            return res.status(403).json({
                error: 'No subscription found. Please complete the checkout process.',
            });
        }

        const subscription = subscriptionResult.rows[0];

        // Skip payment if the user is on the "Test" plan (plan_id = 17)
        if (subscription.plan_id === 17) {
            const token = await generateAuthToken(user.id);

            // Set JWT in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 60 * 1000, // 1 hour
            });

            return res.status(200).json({ role: user.role });
        }

        // If the subscription is inactive, create a Stripe Checkout session
        if (!subscription.is_active) {
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    customer_email: emailLowercase,
                    line_items: [
                        {
                            price: process.env.BASIC_MONTHLY_PRICE_ID, // Replace with your Stripe Price ID
                            quantity: 1,
                        },
                    ],
                    mode: 'subscription',
                    success_url: 'https://app.mypropertypal.com/success?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: 'https://app.mypropertypal.com/cancel',
                });

                // Return the Stripe Checkout URL to the frontend
                return res.status(403).json({
                    error: 'Your subscription is inactive. Please complete the checkout process.',
                    checkoutUrl: session.url,
                });
            } catch (err) {
                console.error('Error creating Stripe Checkout session:', err);
                return res.status(500).json({ error: 'Failed to create checkout session.' });
            }
        }

        const token = await generateAuthToken(user.id);

        // Set JWT in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Return only the role (not the token)
        return res.status(200).json({ role: user.role });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = login;