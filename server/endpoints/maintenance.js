const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// GET: Fetch maintenance requests for the logged-in tenant or landlord
router.get("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    // Ensure role is set on req.user (from your auth middleware/JWT)
    const role = req.user.role;
    let result;

    if (role === "tenant") {
      // Look up tenant_id using account_id
      const tenantRes = await pool.query(
        "SELECT id FROM tenant WHERE account_id = $1",
        [req.user.id]
      );
      const tenantId = tenantRes.rows[0]?.id;
      if (!tenantId) {
        return res.json({ incidents: [] });
      }
      // Only fetch incidents submitted by this tenant
      result = await pool.query(
        `SELECT i.*, p.address AS property_address, s.severity
         FROM incident i
         JOIN property p ON i.property_id = p.id
         JOIN incident_severity s ON i.severity_id = s.id
         WHERE i.tenant_id = $1
         ORDER BY i.created_at DESC`,
        [tenantId]
      );
    } else if (role === "landlord") {
      // Redirect landlords to the /landlord endpoint for their incidents
      return res.redirect("/api/maintenance/landlord");
    } else {
      // Other roles: return empty
      return res.json({ incidents: [] });
    }

    res.json({ incidents: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch maintenance requests." });
  }
});

// POST: Create a new maintenance request
router.post("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { property_id, severity_id, title, description } = req.body;
    let tenant_id;

    // Always look up tenant_id using account_id for reliability
    const tenantRes = await pool.query(
      "SELECT id FROM tenant WHERE account_id = $1",
      [req.user.id]
    );
    tenant_id = tenantRes.rows[0]?.id;

    if (!tenant_id) {
      return res.status(400).json({ error: "Tenant not found for this account." });
    }

    const result = await pool.query(
      `INSERT INTO incident (property_id, severity_id, title, description, tenant_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [property_id, severity_id, title, description, tenant_id]
    );
    res.status(201).json({ incident: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to create maintenance request." });
  }
});

// PUT: Edit a maintenance request
router.put("/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { title, description, severity_id, progress, closed } = req.body;
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE incident
       SET title = $1, description = $2, severity_id = $3, progress = $4, closed = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, description, severity_id, progress, closed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Maintenance request not found." });
    }
    res.json({ incident: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update maintenance request." });
  }
});

// DELETE: Remove a maintenance request
router.delete("/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM incident WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Maintenance request not found." });
    }
    res.json({ message: "Maintenance request deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete maintenance request." });
  }
});

// GET: Fetch properties assigned to the current tenant
router.get("/my-properties", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id; // from token
    // Look up tenant_id using account_id
    const tenantRes = await pool.query(
      "SELECT id FROM tenant WHERE account_id = $1",
      [accountId]
    );
    const tenantId = tenantRes.rows[0]?.id;
    if (!tenantId) {
      return res.status(404).json({ error: "Tenant not found for this account." });
    }
    const result = await pool.query(
      `SELECT p.id, p.address, p.name, p.city, p.county, p.postcode
       FROM property_tenant pt
       JOIN property p ON pt.property_id = p.id
       WHERE pt.tenant_id = $1`,
      [tenantId]
    );
    res.json({ properties: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tenant properties." });
  }
});

// GET: Fetch all maintenance requests for properties owned by the current landlord
router.get("/landlord", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id; // from token
    // Look up landlord_id using account_id
    const landlordRes = await pool.query(
      "SELECT id FROM landlord WHERE account_id = $1",
      [accountId]
    );
    const landlordId = landlordRes.rows[0]?.id;
    if (!landlordId) {
      return res.status(404).json({ error: "Landlord not found for this account." });
    }
    // Get all incidents for properties owned by this landlord
    const result = await pool.query(
      `SELECT i.*, p.address AS property_address, s.severity,
              a.first_name AS tenant_first_name, a.last_name AS tenant_last_name
         FROM incident i
         JOIN property p ON i.property_id = p.id
         JOIN incident_severity s ON i.severity_id = s.id
         LEFT JOIN tenant t ON i.tenant_id = t.id
         LEFT JOIN account a ON t.account_id = a.id
         WHERE p.landlord_id = $1
         ORDER BY i.created_at DESC`,
      [landlordId]
    );
    res.json({ incidents: result.rows });
  } catch (err) {
    console.error("Landlord maintenance error:", err);
    res.status(500).json({ error: "Failed to fetch landlord maintenance requests." });
  }
});

// PUT: Landlord updates progress of a maintenance request
router.put("/landlord/:id/progress", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id;
    const { id } = req.params;
    const { progress } = req.body;

    // Check if the incident belongs to a property owned by this landlord
    const landlordRes = await pool.query(
      "SELECT id FROM landlord WHERE account_id = $1",
      [accountId]
    );
    const landlordId = landlordRes.rows[0]?.id;
    if (!landlordId) {
      return res.status(404).json({ error: "Landlord not found for this account." });
    }
    const incidentRes = await pool.query(
      `SELECT i.id
         FROM incident i
         JOIN property p ON i.property_id = p.id
         WHERE i.id = $1 AND p.landlord_id = $2`,
      [id, landlordId]
    );
    if (incidentRes.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to update this request." });
    }

    // Update progress
    const result = await pool.query(
      `UPDATE incident SET progress = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [progress, id]
    );
    console.log("Progress update request:", { id, progress, accountId, landlordId });
    res.json({ incident: result.rows[0] });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ error: "Failed to update progress." });
  }
});

module.exports = router;