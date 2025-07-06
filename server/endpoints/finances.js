const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Helper to get landlordId from accountId
async function getLandlordId(pool, accountId) {
  const res = await pool.query(
    "SELECT id FROM landlord WHERE account_id = $1",
    [accountId]
  );
  if (res.rows.length === 0) throw new Error("No landlord found for this user");
  return res.rows[0].id;
}

// Get finances summary
router.get("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id;
    const landlordId = await getLandlordId(pool, accountId);

    // Rent payments (with property and tenant info)
    const rentPaymentsResult = await pool.query(`
      SELECT
        rp.id,
        rp.paid_on AS date,
        p.name AS property,
        a.first_name || ' ' || a.last_name AS tenant,
        rp.amount,
        'Received' AS status
      FROM rent_payment rp
      JOIN property p ON rp.property_id = p.id
      JOIN tenant t ON rp.tenant_id = t.id
      JOIN account a ON t.account_id = a.id
      WHERE p.landlord_id = $1
      ORDER BY rp.paid_on DESC
    `, [landlordId]);
    const rentPayments = rentPaymentsResult.rows;

    // Expenses
    const expensesResult = await pool.query(`
      SELECT
        id,
        incurred_on AS date,
        category,
        description,
        amount
      FROM expense
      WHERE landlord_id = $1
      ORDER BY incurred_on DESC
    `, [landlordId]);
    const expenses = expensesResult.rows;

    // Totals
    const totalIncome = rentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const taxableProfit = totalIncome - totalExpenses;

    res.json({
      rentPayments,
      expenses,
      totalIncome,
      totalExpenses,
      taxableProfit
    });
  } catch (err) {
    console.error("Error in /api/finances:", err);
    res.status(500).json({ error: "Failed to fetch finances" });
  }
});

// Add expense
router.post("/expense", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id;
    const landlordId = await getLandlordId(pool, accountId);
    const { property_id, amount, category, description, incurred_on } = req.body;
    const result = await pool.query(
      `INSERT INTO expense (landlord_id, property_id, amount, category, description, incurred_on)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [landlordId, property_id, amount, category, description, incurred_on]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// Add rent payment
router.post("/rent", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id;
    const landlordId = await getLandlordId(pool, accountId);
    const { property_id, tenant_id, amount, paid_on, method, reference } = req.body;
    const result = await pool.query(
      `INSERT INTO rent_payment (property_id, tenant_id, amount, paid_on, method, reference)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [property_id, tenant_id, amount, paid_on, method, reference]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding rent payment:", err);
    res.status(500).json({ error: "Failed to add rent payment" });
  }
});

// Generate and serve tax return PDF
router.get("/tax-report", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  try {
    const accountId = req.user.id;
    const landlordId = await getLandlordId(pool, accountId);
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();

    // Fetch landlord info
    const landlordResult = await pool.query(
      `SELECT a.first_name, a.last_name, a.email FROM landlord l JOIN account a ON l.account_id = a.id WHERE l.id = $1`,
      [landlordId]
    );
    const landlord = landlordResult.rows[0];

    // Fetch rent payments for the tax year
    const rentPaymentsResult = await pool.query(
      `SELECT rp.paid_on, rp.amount, p.name AS property
       FROM rent_payment rp
       JOIN property p ON rp.property_id = p.id
       WHERE p.landlord_id = $1
         AND EXTRACT(YEAR FROM rp.paid_on) = $2
       ORDER BY rp.paid_on`,
      [landlordId, year]
    );
    const rentPayments = rentPaymentsResult.rows;

    // Fetch expenses for the tax year
    const expensesResult = await pool.query(
      `SELECT incurred_on, amount, category, description
       FROM expense
       WHERE landlord_id = $1
         AND EXTRACT(YEAR FROM incurred_on) = $2
       ORDER BY incurred_on`,
      [landlordId, year]
    );
    const expenses = expensesResult.rows;

    // Group expenses by category
    const expensesByCategory = {};
    expenses.forEach(e => {
      if (!expensesByCategory[e.category]) expensesByCategory[e.category] = 0;
      expensesByCategory[e.category] += Number(e.amount);
    });

    // Totals
    const totalIncome = rentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netProfit = totalIncome - totalExpenses;

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const fileName = `tax-report-${landlordId}-${year}.pdf`;
    const exportDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);
    const filePath = path.join(exportDir, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- Write PDF content BEFORE doc.end() ---
    doc.fontSize(20).text("HMRC Tax Return Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Landlord: ${landlord.first_name} ${landlord.last_name} (${landlord.email})`);
    doc.text(`Tax Year: ${year}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(`Total Rental Income: £${totalIncome.toLocaleString()}`);
    doc.text(`Total Allowable Expenses: £${totalExpenses.toLocaleString()}`);
    doc.text(`Net Profit/Loss: £${netProfit.toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Expenses by Category", { underline: true });
    Object.entries(expensesByCategory).forEach(([cat, amt]) =>
      doc.fontSize(12).text(`${cat}: £${amt.toLocaleString()}`)
    );
    doc.moveDown();

    doc.fontSize(14).text("Detailed Expense Breakdown", { underline: true });
    doc.fontSize(12).text("Date        Category           Description           Amount");
    expenses.forEach(item => {
      const dateStr = item.incurred_on
        ? String(item.incurred_on).slice(0, 10)
        : "";
      doc.text(
        `${dateStr}  ${item.category?.padEnd(18) ?? ""}  ${item.description?.padEnd(20) ?? ""}  £${item.amount?.toLocaleString() ?? ""}`
      );
    });
    doc.moveDown();

    doc.fontSize(14).text("Rental Income Breakdown", { underline: true });
    doc.fontSize(12).text("Date        Property           Amount");
    rentPayments.forEach(item => {
      const dateStr = item.paid_on
        ? String(item.paid_on).slice(0, 10)
        : "";
      doc.text(
        `${dateStr}  ${item.property?.padEnd(18) ?? ""}  £${item.amount?.toLocaleString() ?? ""}`
      );
    });

    doc.moveDown();
    doc.fontSize(10).text("This report was generated by MyPropertyPal. For reference only.", { align: "center" });
    doc.text(`Page 1`, { align: "right" });

    // --- End the PDF after writing content ---
    doc.end();

    // Only respond after the PDF is fully written
    stream.on("finish", () => {
      res.json({ url: `/exports/${fileName}` });
    });

    stream.on("error", (err) => {
      console.error("PDF stream error:", err);
      res.status(500).json({ error: "Failed to generate tax report" });
    });
  } catch (err) {
    console.error("Error generating tax report:", err);
    res.status(500).json({ error: "Failed to generate tax report" });
  }
});

// Delete an expense
router.delete("/expense/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM expense WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Delete a rent payment
router.delete("/rent/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rent_payment WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting rent payment:", err);
    res.status(500).json({ error: "Failed to delete rent payment" });
  }
});

module.exports = router;