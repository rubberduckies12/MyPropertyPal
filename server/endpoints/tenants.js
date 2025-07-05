const express = require("express");
const router = express.Router();

// Get all tenants for the logged-in landlord
router.get("/", async (req, res) => {
  const pool = req.app.get("pool");
  const accountId = req.user.id;

  try {
    // Get landlord id
    const landlordResult = await pool.query(
      "SELECT id FROM landlord WHERE account_id = $1",
      [accountId]
    );
    if (landlordResult.rows.length === 0) {
      return res.status(400).json({ error: "No landlord record for this user" });
    }
    const landlordId = landlordResult.rows[0].id;

    // Get tenants linked to this landlord's properties
    const tenantsResult = await pool.query(
      `SELECT t.id, a.first_name, a.last_name, a.email, pt.property_id, p.address, pt.rent_amount, pt.rent_due_date, pt.pays_rent
       FROM tenant t
       JOIN account a ON t.account_id = a.id
       JOIN property_tenant pt ON t.id = pt.tenant_id
       JOIN property p ON pt.property_id = p.id
       WHERE p.landlord_id = $1`,
      [landlordId]
    );
    res.json({ tenants: tenantsResult.rows });
  } catch (err) {
    console.error("Error fetching tenants:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a tenant and link to a property
router.post("/", async (req, res) => {
  const pool = req.app.get("pool");
  const {
    first_name,
    last_name,
    email,
    password,
    property_id,
    rent_due_date,
    rent_amount, // <-- must come from frontend
  } = req.body;

  try {
    // 1. Create account for tenant
    const roleResult = await pool.query(
      "SELECT id FROM account_role WHERE role = 'tenant'"
    );
    const roleId = roleResult.rows[0].id;

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password || "changeme123", 10);

    const accountResult = await pool.query(
      `INSERT INTO account (role_id, first_name, last_name, password, email, email_verified)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id`,
      [roleId, first_name, last_name, hashedPassword, email]
    );
    const accountId = accountResult.rows[0].id;

    // 2. Get landlord id for this property (for validation)
    const landlordResult = await pool.query(
      `SELECT l.id
       FROM property p
       JOIN landlord l ON p.landlord_id = l.id
       WHERE p.id = $1`,
      [property_id]
    );
    if (landlordResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid property" });
    }

    // 3. Create tenant row
    const tenantResult = await pool.query(
      `INSERT INTO tenant (account_id)
       VALUES ($1)
       RETURNING id`,
      [accountId]
    );
    const tenantId = tenantResult.rows[0].id;

    // 4. Link tenant to property with rent_amount from frontend (rent_due_date as integer day of month)
    await pool.query(
      `INSERT INTO property_tenant (property_id, tenant_id, rent_amount, rent_due_date)
       VALUES ($1, $2, $3, $4)`,
      [
        property_id,
        tenantId,
        rent_amount,
        typeof rent_due_date === "string"
          ? parseInt(rent_due_date.split("-")[2], 10)
          : Number(rent_due_date)
      ]
    );

    // 5. Set property status to "Occupied"
    await pool.query(
      `UPDATE property
       SET property_status_id = (
         SELECT id FROM property_status WHERE status = 'Occupied'
       )
       WHERE id = $1`,
      [property_id]
    );

    res.status(201).json({ message: "Tenant added", tenant_id: tenantId });
  } catch (err) {
    console.error("Error adding tenant:", err.stack || err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Remove a tenant (unlink from property and delete tenant/account)
router.delete("/:tenantId", async (req, res) => {
  const pool = req.app.get("pool");
  const tenantId = req.params.tenantId;

  try {
    // Remove from property_tenant
    await pool.query("DELETE FROM property_tenant WHERE tenant_id = $1", [tenantId]);
    // Remove from tenant (will cascade to account if desired)
    await pool.query("DELETE FROM tenant WHERE id = $1", [tenantId]);
    res.json({ message: "Tenant removed" });
  } catch (err) {
    console.error("Error removing tenant:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Count tenants for the logged-in landlord
router.get("/count", async (req, res) => {
  const pool = req.app.get("pool");
  const accountId = req.user.id;

  try {
    // Get landlord id
    const landlordResult = await pool.query(
      "SELECT id FROM landlord WHERE account_id = $1",
      [accountId]
    );
    if (landlordResult.rows.length === 0) {
      return res.json({ count: 0 });
    }
    const landlordId = landlordResult.rows[0].id;

    // Count tenants linked to this landlord's properties
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT t.id) AS count
       FROM tenant t
       JOIN property_tenant pt ON t.id = pt.tenant_id
       JOIN property p ON pt.property_id = p.id
       WHERE p.landlord_id = $1`,
      [landlordId]
    );
    res.json({ count: Number(countResult.rows[0].count) });
  } catch (err) {
    console.error("Error counting tenants:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;