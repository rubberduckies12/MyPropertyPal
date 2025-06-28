// endpoints/properties.js

async function getProperties(req, res, pool) {
  try {
    const landlordId = req.user.id;

    const query = `
      SELECT
        p.id,
        p.name,
        CONCAT_WS(', ', p.address, p.city, p.county, p.postcode) AS full_address,
        ps.status AS property_status,
        a.first_name || ' ' || a.last_name AS lead_tenant_name,
        pt.rent_amount,
        pt.rent_due_date
      FROM property p
      JOIN property_status ps ON p.property_status_id = ps.id
      LEFT JOIN property_tenant pt ON pt.property_id = p.id
      LEFT JOIN tenant t ON pt.tenant_id = t.id
      LEFT JOIN account a ON t.account_id = a.id
      WHERE p.landlord_id = $1
      ORDER BY p.name;
    `;

    const { rows } = await pool.query(query, [landlordId]);

    const properties = rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.full_address,
      status: row.property_status,
      tenant: row.lead_tenant_name && row.lead_tenant_name.trim() !== '' ? row.lead_tenant_name : 'No tenant',
      rent: row.rent_amount != null ? `£${parseFloat(row.rent_amount).toFixed(2)}` : 'N/A',
      // rent_due_date is a SMALLINT (day of month), not a date
      nextRentDue: row.rent_due_date != null ? `Day ${row.rent_due_date} of each month` : 'N/A'
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
