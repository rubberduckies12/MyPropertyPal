const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const authenticate = require("../middleware/authenticate"); // <-- ADD THIS LINE

// Google Vision setup
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../../google-vision-key.json"),
});

// Multer setup for file uploads
const uploadDir = path.join(__dirname, "../../uploads/compliance");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});
const upload = multer({ storage });

// ========== COMPLIANCE EVENTS ==========

// Get all compliance events for a landlord
router.get("/events", authenticate, async (req, res) => {
  try {
    const pool = req.app.get("pool");
    let landlordId = req.user.landlord_id;
    if (!landlordId) {
      // Fallback: look up landlord_id from account_id (req.user.id)
      const landlordRes = await pool.query(
        "SELECT id FROM landlord WHERE account_id = $1",
        [req.user.id]
      );
      landlordId = landlordRes.rows[0]?.id;
      if (!landlordId) {
        return res.json([]); // No landlord found for this account
      }
    }
    const result = await pool.query(
      `SELECT ce.*, p.name AS property_name
       FROM compliance_event ce
       JOIN property p ON ce.property_id = p.id
       WHERE p.landlord_id = $1
       ORDER BY ce.due_date ASC`,
      [landlordId]
    );
    res.json(Array.isArray(result.rows) ? result.rows : []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Add a compliance event
router.post("/events", async (req, res) => {
  try {
    const { property_id, name, description, due_date } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `INSERT INTO compliance_event (property_id, name, description, due_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [property_id, name, description, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add compliance event" });
  }
});

// Edit a compliance event
router.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, due_date } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `UPDATE compliance_event SET name=$1, description=$2, due_date=$3 WHERE id=$4 RETURNING *`,
      [name, description, due_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update compliance event" });
  }
});

// Delete a compliance event
router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.get("pool");
    await pool.query(`DELETE FROM compliance_event WHERE id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete compliance event" });
  }
});

// ========== DOCUMENT UPLOAD & SCAN ==========

// Upload and scan a compliance document
router.post("/documents/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    // Use Google Vision API to extract text
    const [result] = await visionClient.textDetection(filePath);
    const text = result.fullTextAnnotation ? result.fullTextAnnotation.text : "";

    // Try to extract expiry date (simple regex for DD/MM/YYYY or YYYY-MM-DD)
    const expiryMatch = text.match(/(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})/);
    const expiry = expiryMatch ? expiryMatch[0] : null;

    res.json({
      file: req.file.filename,
      ocrText: text,
      expiry,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to scan document" });
  }
});

// ========== DOCUMENTS CRUD ==========

// Get all compliance documents for a landlord
router.get("/documents", authenticate, async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const landlordId = req.user.landlord_id; // Get landlord_id from JWT
    const result = await pool.query(
      `SELECT d.*, p.name AS property_name
       FROM document d
       JOIN property p ON d.property_id = p.id
       WHERE p.landlord_id = $1
       ORDER BY d.uploaded_at DESC`,
      [landlordId]
    );
    res.json(Array.isArray(result.rows) ? result.rows : []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Add a compliance document (after upload/scan)
router.post("/documents", async (req, res) => {
  try {
    const { property_id, tenant_id, document_type_id, document_path, expiry } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `INSERT INTO document (property_id, tenant_id, document_type_id, document_path, uploaded_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [property_id, tenant_id, document_type_id, document_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add document" });
  }
});

// Edit a compliance document
router.put("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { document_type_id, document_path } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `UPDATE document SET document_type_id=$1, document_path=$2 WHERE id=$3 RETURNING *`,
      [document_type_id, document_path, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete a compliance document
router.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.get("pool");
    await pool.query(`DELETE FROM document WHERE id=$1`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;