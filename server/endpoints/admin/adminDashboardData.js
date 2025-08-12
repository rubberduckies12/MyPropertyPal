const express = require("express");
const router = express.Router();

// Route 1: Count all users in the landlord table
router.get("/landlord-count", async (req, res) => {
  const pool = req.app.get("pool"); // Get the database connection pool

  try {
    const result = await pool.query("SELECT COUNT(*) AS count FROM landlord");
    const landlordCount = result.rows[0].count;

    res.status(200).json({ landlordCount });
  } catch (err) {
    console.error("Error fetching landlord count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route 2: Calculate monthly income, incomplete tasks, and recent tasks
router.get("/dashboard-summary", async (req, res) => {
  const pool = req.app.get("pool"); // Get the database connection pool
  const adminId = req.user.id; // Assume the logged-in admin's ID is available in req.user

  try {
    // 1. Calculate total monthly income
    const incomeResult = await pool.query(`
      SELECT COALESCE(SUM(pp.monthly_rate), 0) AS total_monthly_income
      FROM landlord l
      JOIN payment_plan pp ON l.payment_plan_id = pp.id
    `);
    const totalMonthlyIncome = incomeResult.rows[0].total_monthly_income;

    // 2. Count incomplete tasks for the logged-in admin
    const tasksResult = await pool.query(`
      SELECT COUNT(*) AS incomplete_tasks
      FROM productivity_task
      WHERE admin_id = $1 AND progress != 'Completed'
    `, [adminId]);
    const incompleteTasks = tasksResult.rows[0].incomplete_tasks;

    // 3. Fetch the most recent three incomplete tasks
    const recentTasksResult = await pool.query(`
      SELECT task_name, progress, date_needed
      FROM productivity_task
      WHERE admin_id = $1 AND progress != 'Completed'
      ORDER BY date_needed DESC
      LIMIT 3
    `, [adminId]);
    const recentTasks = recentTasksResult.rows;

    res.status(200).json({
      totalMonthlyIncome,
      incompleteTasks,
      recentTasks,
    });
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;