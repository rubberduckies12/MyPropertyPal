const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

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

// Register endpoint
router.post('/', async (req, res) => {
  const pool = req.app.get('pool'); // Access the database pool from the app
  console.log("REGISTER BODY:", req.body);
  const { email, password, role, propertyId, firstName, lastName, invite, plan_name, billing_cycle } = req.body || {};

  if (invite) {
    // Invite-based registration (tenant)
    try {
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

  if (!email || !password || !role || !firstName || !lastName || !plan_name || !billing_cycle) {
    return res.status(400).json({ error: 'Email, password, role, first name, last name, plan, and billing cycle are required.' });
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

    // Insert new user into account
    const accountResult = await pool.query(
      `INSERT INTO account (id, role_id, first_name, last_name, password, email, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE)
       RETURNING id, email, role_id, email_verified, first_name, last_name`,
      [userId, role_id, firstName, lastName, hashedPassword, email]
    );
    const accountId = accountResult.rows[0].id;

    // If landlord, insert into landlord table and create subscription
    if (role === 'landlord') {
      const planResult = await pool.query(
        'SELECT id, name, monthly_rate, yearly_rate FROM payment_plan WHERE LOWER(name) = $1',
        [plan_name.toLowerCase()]
      );
      if (planResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid plan selected.' });
      }
      const plan = planResult.rows[0];

      if (!['monthly', 'yearly'].includes(billing_cycle)) {
        return res.status(400).json({ error: 'Invalid billing cycle.' });
      }

      // Insert into landlord table with payment_plan_id
      const landlordResult = await pool.query(
        `INSERT INTO landlord (account_id, payment_plan_id) VALUES ($1, $2) RETURNING id`,
        [accountId, plan.id]
      );
      const landlordId = landlordResult.rows[0].id;

      // Insert into subscription table
      await pool.query(
        `INSERT INTO subscription (
          landlord_id, plan_id, status, is_active, created_at, updated_at
        ) VALUES ($1, $2, 'active', TRUE, NOW(), NOW())`,
        [landlordId, plan.id]
      );
    }

    return res.status(201).json(accountResult.rows[0]);
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;