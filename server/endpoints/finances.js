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

    // Fetch user info
    const userResult = await pool.query(
      "SELECT id, email, first_name, last_name FROM account WHERE id = $1",
      [accountId]
    );
    const user = userResult.rows[0];

    // Rent payments (with property and tenant info)
    const rentPaymentsResult = await pool.query(`
      SELECT
        rp.id,
        rp.paid_on,
        p.name AS property_name,
        p.address AS property_address,
        a.first_name || ' ' || a.last_name AS tenant,
        rp.amount,
        rp.method,
        rp.reference,
        rp.due_date,
        CASE
          WHEN rp.paid_on > rp.due_date THEN 'Late'
          ELSE 'On Time'
        END AS payment_status
      FROM rent_payment rp
      JOIN property p ON rp.property_id = p.id
      JOIN tenant t ON rp.tenant_id = t.id
      JOIN account a ON t.account_id = a.id
      WHERE p.landlord_id = $1
      ORDER BY rp.paid_on DESC
    `, [landlordId]);

    const rentPayments = rentPaymentsResult.rows.map(rp => ({
      ...rp,
      property: [rp.property_name, rp.property_address].filter(Boolean).join(" ")
    }));

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
      user,
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

    // Get current rent schedule info and due date
    const ptRes = await pool.query(
      `SELECT rent_due_date, rent_schedule_type, rent_schedule_value
       FROM property_tenant
       WHERE property_id = $1 AND tenant_id = $2`,
      [property_id, tenant_id]
    );
    let due_date = null;
    if (ptRes.rows.length) {
      due_date = ptRes.rows[0].rent_due_date;
      let { rent_schedule_type, rent_schedule_value } = ptRes.rows[0];
      let nextDue = new Date(due_date);

      // Advance due date based on schedule
      if (rent_schedule_type === "monthly") {
        nextDue.setMonth(nextDue.getMonth() + 1);
      } else if (rent_schedule_type === "weekly") {
        nextDue.setDate(nextDue.getDate() + 7);
      } else if (rent_schedule_type === "biweekly") {
        nextDue.setDate(nextDue.getDate() + 14);
      } else if (rent_schedule_type === "last_friday") {
        // Find last Friday of next month
        let year = nextDue.getFullYear();
        let month = nextDue.getMonth() + 1;
        if (month > 11) { month = 0; year++; }
        let d = new Date(year, month + 1, 0);
        while (d.getDay() !== 5) d.setDate(d.getDate() - 1);
        nextDue = d;
      }
      // Optionally, handle custom schedule_value logic here

      // Update next due date in property_tenant
      await pool.query(
        `UPDATE property_tenant SET rent_due_date = $1 WHERE property_id = $2 AND tenant_id = $3`,
        [nextDue.toISOString().slice(0, 10), property_id, tenant_id]
      );
    }

    // Insert rent payment with due_date
    const result = await pool.query(
      `INSERT INTO rent_payment (property_id, tenant_id, amount, paid_on, method, reference, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [property_id, tenant_id, amount, paid_on, method, reference, due_date]
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
    const uniqueSuffix = Date.now(); // or use: require('crypto').randomBytes(4).toString('hex')
    const fileName = `tax-report-${landlordId}-${year}-${uniqueSuffix}.pdf`;
    const exportDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);
    const filePath = path.join(exportDir, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- Cover Page ---
    doc.fontSize(24).font("Helvetica-Bold").text("Micro-Entity Accounts", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(16).font("Helvetica").text(`For the year ended 31 December ${year}`, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(14).text(`Company/Landlord: ${landlord.first_name} ${landlord.last_name}`);
    doc.text(`Email: ${landlord.email}`);
    doc.text(`Report generated: ${new Date().toLocaleString()}`);
    doc.addPage();

    // --- Profit and Loss Account ---
    doc.fontSize(18).font("Helvetica-Bold").text("Profit and Loss Account", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).font("Helvetica").text(`Period: 1 January ${year} to 31 December ${year}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Turnover (Rental Income):", { continued: true }).font("Helvetica").text(` £${totalIncome.toLocaleString()}`);
    doc.fontSize(12).font("Helvetica-Bold").text("Cost of Sales (Allowable Expenses):", { continued: true }).font("Helvetica").text(` £${totalExpenses.toLocaleString()}`);
    doc.fontSize(12).font("Helvetica-Bold").text("Gross Profit:", { continued: true }).font("Helvetica").text(` £${(totalIncome - totalExpenses).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Expenses Breakdown:");
    doc.moveDown(0.5);

    // Table header
    doc.font("Helvetica-Bold").text("Category", 60, doc.y, { continued: true });
    doc.text("Amount (£)", 300, doc.y);
    doc.font("Helvetica");
    Object.entries(expensesByCategory).forEach(([cat, amt]) => {
      doc.text(cat, 60, doc.y, { continued: true });
      doc.text(amt.toLocaleString(), 300, doc.y);
    });
    doc.moveDown(2);

    // --- Balance Sheet (Simple) ---
    doc.fontSize(18).font("Helvetica-Bold").text("Balance Sheet", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).font("Helvetica-Bold").text("Current Assets:", { continued: true }).font("Helvetica").text(" £0");
    doc.fontSize(12).font("Helvetica-Bold").text("Cash at Bank and in Hand:", { continued: true }).font("Helvetica").text(" £0");
    doc.fontSize(12).font("Helvetica-Bold").text("Creditors: Amounts falling due within one year:", { continued: true }).font("Helvetica").text(" £0");
    doc.fontSize(12).font("Helvetica-Bold").text("Net Current Assets:", { continued: true }).font("Helvetica").text(" £0");
    doc.fontSize(12).font("Helvetica-Bold").text("Total Net Assets:", { continued: true }).font("Helvetica").text(` £${(totalIncome - totalExpenses).toLocaleString()}`);
    doc.moveDown(2);

    // --- Detailed Expense Table ---
    doc.fontSize(16).font("Helvetica-Bold").text("Detailed Expense Breakdown", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).font("Helvetica-Bold").text("Date", 60, doc.y, { continued: true });
    doc.text("Category", 120, doc.y, { continued: true });
    doc.text("Description", 240, doc.y, { continued: true });
    doc.text("Amount (£)", 400, doc.y);
    doc.font("Helvetica");
    expenses.forEach(item => {
      const dateStr = item.incurred_on ? String(item.incurred_on).slice(0, 10) : "";
      doc.text(dateStr, 60, doc.y, { continued: true });
      doc.text(item.category ?? "", 120, doc.y, { continued: true });
      doc.text(item.description ?? "", 240, doc.y, { continued: true });
      doc.text(item.amount?.toLocaleString() ?? "", 400, doc.y);
    });
    doc.moveDown(2);

    // --- Rental Income Table ---
    doc.fontSize(16).font("Helvetica-Bold").text("Rental Income Breakdown", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).font("Helvetica-Bold").text("Date", 60, doc.y, { continued: true });
    doc.text("Property", 150, doc.y, { continued: true });
    doc.text("Amount (£)", 350, doc.y);
    doc.font("Helvetica");
    rentPayments.forEach(item => {
      const dateStr = item.paid_on ? String(item.paid_on).slice(0, 10) : "";
      doc.text(dateStr, 60, doc.y, { continued: true });
      doc.text(item.property ?? "", 150, doc.y, { continued: true });
      doc.text(item.amount?.toLocaleString() ?? "", 350, doc.y);
    });
    doc.moveDown(2);

    // --- Declaration Section ---
    doc.fontSize(12).font("Helvetica-Bold").text("Director's/Owner's Declaration");
    doc.font("Helvetica").text(
      "I acknowledge my responsibility for preparing accounts that give a true and fair view of the state of affairs of the company/landlord at the end of the financial year and of its profit or loss for the financial year in accordance with the requirements of the Companies Act 2006."
    );
    doc.moveDown(2);
    doc.text("Signed: _____________________________", { continued: true });
    doc.text("    Date: ___________________", doc.y);

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

// Edit an expense
router.put("/expense/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { id } = req.params;
  const { property_id, amount, category, description, incurred_on } = req.body;
  try {
    const result = await pool.query(
      `UPDATE expense SET property_id=$1, amount=$2, category=$3, description=$4, incurred_on=$5 WHERE id=$6 RETURNING *`,
      [property_id, amount, category, description, incurred_on, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// Edit a rent payment
router.put("/rent/:id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { id } = req.params;
  const { property_id, tenant_id, amount, paid_on, method, reference, due_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE rent_payment SET property_id=$1, tenant_id=$2, amount=$3, paid_on=$4, method=$5, reference=$6, due_date=$7 WHERE id=$8 RETURNING *`,
      [property_id, tenant_id, amount, paid_on, method, reference, due_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update rent payment" });
  }
});

// Expected rent router
router.get("/expected-rent", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const accountId = req.user.id;
  const landlordId = await getLandlordId(pool, accountId);

  // Get all active tenants for this landlord
  const tenantsResult = await pool.query(`
    SELECT pt.property_id, pt.tenant_id, pt.rent_amount, pt.rent_due_date, pt.rent_schedule_type, pt.rent_schedule_value,
           a.first_name, a.last_name, p.name AS property_name, p.address
    FROM property_tenant pt
    JOIN tenant t ON pt.tenant_id = t.id
    JOIN account a ON t.account_id = a.id
    JOIN property p ON pt.property_id = p.id
    WHERE p.landlord_id = $1
  `, [landlordId]);

  const today = new Date();
  const expected = [];

  for (const t of tenantsResult.rows) {
    let dueDate = new Date(t.rent_due_date);
    dueDate.setHours(0,0,0,0);

    // Find the last paid rent for this tenant/property
    const lastPaidRes = await pool.query(
      `SELECT due_date FROM rent_payment WHERE tenant_id = $1 AND property_id = $2 ORDER BY due_date DESC LIMIT 1`,
      [t.tenant_id, t.property_id]
    );
    let startDue = lastPaidRes.rows.length > 0
      ? new Date(lastPaidRes.rows[0].due_date)
      : new Date(dueDate);

    // Go from the last paid due date (or original due date) up to today
    let currentDue = new Date(startDue);
    while (currentDue <= today) {
      // Check if this due date has been paid
      const rentPaymentRes = await pool.query(
        `SELECT * FROM rent_payment WHERE tenant_id = $1 AND property_id = $2 AND due_date = $3`,
        [t.tenant_id, t.property_id, currentDue.toISOString().split("T")[0]]
      );
      let status = "Not Paid";
      let paid_on = null;
      if (rentPaymentRes.rows.length > 0) {
        status = "Paid";
        paid_on = rentPaymentRes.rows[0].paid_on;
      } else if (currentDue < today) {
        status = "Overdue";
      }

      // Only push if not paid or overdue
      if (status !== "Paid") {
        expected.push({
          property: [t.property_name, t.address].filter(Boolean).join(" "),
          tenant: `${t.first_name} ${t.last_name}`,
          amount: t.rent_amount,
          due_date: currentDue.toISOString().split("T")[0],
          status,
          paid_on,
          property_id: t.property_id,
          tenant_id: t.tenant_id,
        });
      }

      // Advance to next due date based on schedule
      if (t.rent_schedule_type === "monthly") {
        currentDue.setMonth(currentDue.getMonth() + 1);
      } else if (t.rent_schedule_type === "weekly") {
        currentDue.setDate(currentDue.getDate() + 7);
      } else if (t.rent_schedule_type === "biweekly") {
        currentDue.setDate(currentDue.getDate() + 14);
      } else if (t.rent_schedule_type === "last_friday") {
        // Find last Friday of next month
        let year = currentDue.getFullYear();
        let month = currentDue.getMonth() + 1;
        if (month > 11) { month = 0; year++; }
        let d = new Date(year, month + 1, 0);
        while (d.getDay() !== 5) d.setDate(d.getDate() - 1);
        currentDue = d;
      } else {
        // Default: monthly
        currentDue.setMonth(currentDue.getMonth() + 1);
      }
      currentDue.setHours(0,0,0,0);
    }
  }

  res.json({ expected });
});

module.exports = router;