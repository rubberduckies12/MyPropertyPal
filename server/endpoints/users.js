const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../db');

// generate a unique user id
async function generateUniqueUserId() {
  const result = await pool.query('SELECT MAX(id) AS max_id FROM account');
  return (result.rows[0].max_id || 0) + 1;
}

// User registration route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    //Find role_id
    const roleResult = await pool.query('SELECT id FROM role WHERE role = $1', [role]);
    if (roleResult.rowCount === 0) return res.status(400).json({ error: 'Invalid role' });
    const role_id = roleResult.rows[0].id;

    //Hash password currently using bcrypt - fin use your own hashing function
    const hashedPassword = await bcrypt.hash(password, 10);

    //Generate new user id
    const newId = await generateUniqueUserId();

    //Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    //Insert user
    await pool.query(
        `INSERT INTO account (id, role_id, password, email, email_verified)
         VALUES ($1, $2, $3, $4, $5)`,
        [newId, role_id, hashedPassword, email, false]
    );

    // Insert verification token - not sure db is structured for this yet

    //Send verification email using node mailer for this
    const verifyUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });

    res.status(201).json({ id: newId, email, role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    // Block login if not verified - verification token not implemented in db yet
    if (!user.email_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // once token expires well prompt user to login again by listen for 401 err on front end
    );

    res.json({
      token,
      user: {
        id: user.id,
        role_id: user.role_id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/*
  --- LIBRARIES USED IN THIS FILE ---

  express      - Web framework for Node.js, used to create the router and define API endpoints.
  bcrypt       - Library for hashing and comparing passwords securely.
  jsonwebtoken - Library for creating and verifying JWT tokens for authentication.
  crypto       - Node.js built-in module for generating secure random tokens (used for email verification).
  nodemailer   - Library for sending emails (used here to send verification emails).
  pg           - PostgreSQL client for Node.js, used via the imported 'pool' object to interact with the database.
*/

