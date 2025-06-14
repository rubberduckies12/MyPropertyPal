const authenticateJWT = require('../middleware/jwt');

module.exports = async function propertiesHandler(req, res, pool) {
  // Authenticate all requests to this endpoint
  await authenticateJWT(req, res, async () => {
    if (req.method === "POST") {
      // Add property
      const { address, city, county, postcode, status, landlord_id } = req.body;
      try {
        const statusResult = await pool.query(
          "SELECT id FROM property_status WHERE status = $1",
          [status]
        );
        if (statusResult.rows.length === 0) {
          return res.status(400).json({ error: "Invalid status" });
        }
        const statusId = statusResult.rows[0].id;
        // Insert property (no rent_amount)
        const insert = await pool.query(
          `INSERT INTO property (landlord_id, address, city, county, postcode, property_status_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [landlord_id, address, city, county, postcode, statusId]
        );
        res.status(201).json(insert.rows[0]);
      } catch (err) {
        console.error("Error adding property:", err);
        res.status(500).json({ error: "Failed to add property" });
      }
      return;
    }

    try {
      const result = await pool.query(`
        SELECT
          p.id,
          p.number,
          p.name,
          p.address,
          p.city,
          p.county,
          p.postcode,
          ps.status,
          p.lead_tenant_id,
          t.id AS tenant_id,
          a.first_name AS tenant_first_name,
          a.last_name AS tenant_last_name,
          pt.rent_amount,
          pt.rent_due_date
        FROM property p
        JOIN property_status ps ON p.property_status_id = ps.id
        LEFT JOIN tenant t ON p.lead_tenant_id = t.id
        LEFT JOIN account a ON t.account_id = a.id
        LEFT JOIN property_tenant pt ON pt.property_id = p.id AND pt.tenant_id = t.id
        ORDER BY p.id DESC
      `);

      const properties = result.rows.map(row => ({
        id: row.id,
        number: row.number,
        name: row.name,
        address: row.address,
        city: row.city,
        county: row.county,
        postcode: row.postcode,
        status: row.status,
        leadTenant: row.tenant_id
          ? { first_name: row.tenant_first_name, last_name: row.tenant_last_name }
          : null,
        rent_amount: row.rent_amount,
        nextRentDue: row.rent_due_date,
        // Add more fields as needed
      }));

      res.json(properties);
    } catch (err) {
      console.error("Error fetching properties:", err);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });
};