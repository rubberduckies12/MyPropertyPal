// endpoints/properties.js

async function getProperties(req, res, pool) {
  try {
    const accountId = req.user.id;
    // Look up the landlord id for this account
    const landlordResult = await pool.query(
      'SELECT id FROM landlord WHERE account_id = $1',
      [accountId]
    );
    if (landlordResult.rows.length === 0) {
      return res.status(400).json({ error: 'No landlord record for this user' });
    }
    const landlordId = landlordResult.rows[0].id;

    const query = `
      SELECT
        p.id,
        p.name,
        CONCAT_WS(', ', p.address, p.city, p.county, p.postcode) AS full_address,
        ps.status AS property_status,
        COALESCE(SUM(pt.rent_amount), 0) AS total_rent,
        COALESCE(
          json_agg(
            json_build_object(
              'first_name', a.first_name,
              'last_name', a.last_name,
              'rent_amount', pt.rent_amount,
              'rent_due_date', pt.rent_due_date
            )
          ) FILTER (WHERE pt.tenant_id IS NOT NULL), '[]'
        ) AS tenants,
        MIN(pt.rent_due_date) AS next_rent_due
      FROM property p
      JOIN property_status ps ON p.property_status_id = ps.id
      LEFT JOIN property_tenant pt ON pt.property_id = p.id
      LEFT JOIN tenant t ON pt.tenant_id = t.id
      LEFT JOIN account a ON t.account_id = a.id
      WHERE p.landlord_id = $1
      GROUP BY p.id, p.name, p.address, p.city, p.county, p.postcode, ps.status
      ORDER BY p.name;
    `;

    const { rows } = await pool.query(query, [landlordId]);

    const properties = rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.full_address,
      status: row.property_status,
      rental_income: row.total_rent > 0 ? `£${parseFloat(row.total_rent).toFixed(2)}` : 'N/A',
      tenants: row.tenants,
      nextRentDue: row.next_rent_due ? `Day ${row.next_rent_due} of month` : 'N/A'
    }));

    res.json({ properties });

  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addProperty(req, res, pool) {
  try {
    // Get the account id from the JWT
    const accountId = req.user.id;

    // Look up the landlord id for this account
    const landlordResult = await pool.query(
      'SELECT id FROM landlord WHERE account_id = $1',
      [accountId]
    );
    if (landlordResult.rows.length === 0) {
      return res.status(400).json({ error: 'No landlord record for this user' });
    }
    const landlordId = landlordResult.rows[0].id;

    // Check the subscription plan and property limits
    const subscriptionResult = await pool.query(
      `SELECT p.name AS plan_name, p.max_properties
       FROM subscription s
       JOIN payment_plan p ON s.plan_id = p.id
       WHERE s.landlord_id = $1 AND s.is_active = TRUE
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [landlordId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(403).json({ error: 'No active subscription found.' });
    }

    const { plan_name, max_properties } = subscriptionResult.rows[0];

    // Count the current number of properties
    const propertyCountResult = await pool.query(
      'SELECT COUNT(*) AS property_count FROM property WHERE landlord_id = $1',
      [landlordId]
    );
    const propertyCount = parseInt(propertyCountResult.rows[0].property_count, 10);

    // Enforce property limits
    if (max_properties !== null && propertyCount >= max_properties) {
      return res.status(403).json({
        error: `Your subscription plan (${plan_name}) allows a maximum of ${max_properties} properties. Upgrade your plan to add more properties.`,
      });
    }

    // Extract property details from the request body
    const { name, address, city, county, postcode, status, lead_tenant_id, rent_amount, rent_due_date } = req.body;

    // Find the property_status_id for the given status string
    const statusResult = await pool.query(
      'SELECT id FROM property_status WHERE status = $1',
      [status]
    );
    if (statusResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid property status' });
    }
    const property_status_id = statusResult.rows[0].id;

    // Insert property
    const propertyResult = await pool.query(
      `INSERT INTO property (landlord_id, property_status_id, lead_tenant_id, name, address, city, county, postcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [landlordId, property_status_id, lead_tenant_id || null, name, address, city, county, postcode]
    );
    const propertyId = propertyResult.rows[0].id;

    // Optionally insert into property_tenant if tenant and rent info provided
    if (lead_tenant_id && rent_amount) {
      await pool.query(
        `INSERT INTO property_tenant (property_id, tenant_id, rent_amount, rent_due_date)
         VALUES ($1, $2, $3, $4)`,
        [
          propertyId,
          lead_tenant_id,
          rent_amount,
          rent_due_date !== undefined && rent_due_date !== null && rent_due_date !== ""
            ? Number(rent_due_date)
            : null
        ]
      );
      // Set property status to "Occupied"
      await pool.query(
        `UPDATE property
         SET property_status_id = (
           SELECT id FROM property_status WHERE status = 'Occupied'
         )
         WHERE id = $1`,
        [propertyId]
      );
    }

    res.status(201).json({ id: propertyId });
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteProperty(req, res, pool) {
  try {
    const propertyId = req.params.id;
    // Optionally: check ownership here
    await pool.query("DELETE FROM property WHERE id = $1", [propertyId]);
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getProperties, addProperty, deleteProperty };
