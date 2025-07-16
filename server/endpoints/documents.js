const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authenticate = require("../middleware/authenticate");

// Load Google Vision credentials JSON as an object
const vision = require("@google-cloud/vision");
const credentials = JSON.parse(fs.readFileSync("/etc/secrets/google-vision-key.json"));
const client = new vision.ImageAnnotatorClient({ credentials });



// Multer setup for file uploads
const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/(pdf|jpeg|jpg|png)$/i)) {
      return cb(new Error("Only PDF, JPG, and PNG files are allowed"));
    }
    cb(null, true);
  }
});

// Helper to get landlordId from accountId
async function getLandlordId(pool, accountId) {
  const res = await pool.query(
    "SELECT id FROM landlord WHERE account_id = $1",
    [accountId]
  );
  if (res.rows.length === 0) throw new Error("No landlord found for this user");
  return res.rows[0].id;
}

// Upload and scan document
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const landlordId = await getLandlordId(pool, req.user.id); // implement this helper as in finances.js

    const filePath = req.file.path;
    let text = "";

    // Log the uploaded file details
    console.log("Uploaded file path:", filePath, "MIME type:", req.file.mimetype);

    // OCR with Google Vision
    if (req.file.mimetype === "application/pdf") {
      // For PDFs, use documentTextDetection
      const [result] = await client.documentTextDetection(filePath);
      text = result.fullTextAnnotation ? result.fullTextAnnotation.text : "";
      // Log the Vision API result
      console.log("Vision API result:", JSON.stringify(result, null, 2));
    } else {
      // For images, use textDetection
      const [result] = await client.textDetection(filePath);
      text = result.fullTextAnnotation ? result.fullTextAnnotation.text : "";
      // Log the Vision API result
      console.log("Vision API result:", JSON.stringify(result, null, 2));
    }

    // Log the OCR result
    console.log("OCR TEXT:", text);

    // Clean up whitespace
    text = text.replace(/\s+/g, " ");

    // Split text into lines for context search
    const lines = text.split(/[\r\n]+/);

    // Define keywords to look for
    const keywords = [
      "total due", "amount due", "balance due", "amount owed", "total", "grand total", "invoice total"
    ];

    // Try to find all amounts near keywords
    let keywordAmounts = [];
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        const matches = [...line.matchAll(/(?:£|E)?\s*([\d,]+(?:\.\d{2})?)/g)];
        keywordAmounts.push(...matches.map(m => parseFloat((m[1] || "").replace(/,/g, ""))).filter(Boolean));
      }
    }

    // Pick the largest amount near keywords, if any
    let amount = keywordAmounts.length > 0 ? Math.max(...keywordAmounts) : null;

    // Fallback: pick the largest amount in the whole document if no keyword match
    if (!amount) {
      const matches = [...text.matchAll(/(?:£|E)?\s*([\d,]+(?:\.\d{2})?)/g)];
      const amounts = matches.map(m => parseFloat((m[1] || "").replace(/,/g, ""))).filter(Boolean);
      amount = amounts.length > 0 ? Math.max(...amounts) : null;
    }

    // Add to expenses if amount found
    let expense = null;
    if (amount) {
      const now = new Date();
      const result = await pool.query(
        `INSERT INTO expense (landlord_id, amount, category, description, incurred_on)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [landlordId, amount, "Scanned Document", "Auto-extracted from upload", now]
      );
      expense = result.rows[0];
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      text,
      amount,
      expense,
      message: amount
        ? `Expense of £${amount.toFixed(2)} added automatically.`
        : "No amount found in document."
    });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
});

// Get all documents (expenses) for the logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const landlordId = await getLandlordId(pool, req.user.id);
    const result = await pool.query(
      `SELECT id, amount, category, description, incurred_on
       FROM expense
       WHERE landlord_id = $1
       ORDER BY incurred_on DESC`,
      [landlordId]
    );
    // You can adjust fields as needed
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

module.exports = router;