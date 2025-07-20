const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const authenticate = require("../middleware/authenticate");

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
      `SELECT ce.*, 
              p.name AS property_name, 
              p.address AS property_address, 
              p.postcode AS property_postcode
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
router.post("/events", authenticate, async (req, res) => {
  try {
    const { property_id, name, description, due_date, reminder_days } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `INSERT INTO compliance_event (property_id, name, description, due_date, reminder_days)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [property_id, name, description, due_date, reminder_days && reminder_days.length ? reminder_days : [90]]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add compliance event" });
  }
});

// Edit a compliance event
router.put("/events/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, due_date, reminder_days } = req.body;
    const pool = req.app.get("pool");
    const result = await pool.query(
      `UPDATE compliance_event SET name=$1, description=$2, due_date=$3, reminder_days=$4 WHERE id=$5 RETURNING *`,
      [name, description, due_date, reminder_days && reminder_days.length ? reminder_days : [90], id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update compliance event" });
  }
});

// Delete a compliance event
router.delete("/events/:id", authenticate, async (req, res) => {
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
router.post("/documents", authenticate, async (req, res) => {
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
router.put("/documents/:id", authenticate, async (req, res) => {
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
router.delete("/documents/:id", authenticate, async (req, res) => {
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

// === Scheduled Compliance Reminder Emails ===
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const createDatabaseConnection = require("../assets/databaseConnect");
const scheduledPool = createDatabaseConnection();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Run daily at 9am
cron.schedule("0 9 * * *", async () => {
  try {
    const eventsRes = await scheduledPool.query(`
      SELECT ce.*, p.name AS property_name, p.address, l.id AS landlord_id, a.first_name, a.email
      FROM compliance_event ce
      JOIN property p ON ce.property_id = p.id
      JOIN landlord l ON p.landlord_id = l.id
      JOIN account a ON l.account_id = a.id
    `);

    const today = new Date();
    for (const event of eventsRes.rows) {
      const dueDate = new Date(event.due_date);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const reminders = event.reminder_days || [90];
      for (const days of reminders) {
        if (diffDays === days) {
          // Check if already sent
          const sentRes = await scheduledPool.query(
            "SELECT 1 FROM compliance_reminder_sent WHERE event_id=$1 AND reminder_days=$2",
            [event.id, days]
          );
          if (sentRes.rowCount === 0) {
            // Send email
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: event.email,
              subject: `Reminder: Renew ${event.name} for ${event.property_name}`,
              text: `Hello, ${event.first_name}.\n\nThis is a reminder to renew ${event.name}.\n\nDescription: ${event.description}\n\nFor: ${event.property_name} (${event.address}) before ${dueDate.toLocaleDateString("en-GB")}\n\nKind regards,\n\nMyPropertyPal`
            });
            // Mark as sent
            await scheduledPool.query(
              "INSERT INTO compliance_reminder_sent (event_id, reminder_days) VALUES ($1, $2)",
              [event.id, days]
            );
          }
        }
      }
    }
    console.log("Compliance reminders checked and sent if needed.");
  } catch (err) {
    console.error("Error sending compliance reminders:", err);
  }
});