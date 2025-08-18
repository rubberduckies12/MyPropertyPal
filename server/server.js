require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { Pool } = require("pg");
const cookieParser = require('cookie-parser');

const createDatabaseConnection = require('./assets/databaseConnect');
const authenticate = require('./middleware/authenticate');
const checkSubscriptionStatus = require('./middleware/checkSubscriptionStatus');

// Endpoint routers for app pages
const login = require('./endpoints/login');
const register = require('./endpoints/register');
const dashRouter = require('./endpoints/dash');
const chatRoute = require('./endpoints/chat');
const tenantsRouter = require('./endpoints/tenants');
const propertiesRouter = require('./endpoints/properties');
const financesRouter = require('./endpoints/finances');
const documentsRouter = require('./endpoints/documents');
const complianceRouter = require('./endpoints/compliance');
const maintenanceRouter = require('./endpoints/maintenance');
const messagesRouter = require('./endpoints/messages.js');
const stripeRouter = require('./endpoints/stripe');
const stripeWebhookRouter = require('./endpoints/stripeWebhook');
const accountRouter = require('./endpoints/account.js');
const tenantRentRouter = require('./endpoints/tenants/tenantRent');
const { searchContractors } = require('./database/getcontractors');
const cancelAccountRouter = require('./endpoints/cancelAccount');
const resetPasswordRouter = require("./endpoints/resetPassword");
const adminLoginRouter = require("./endpoints/admin/adminLogin"); // Import the admin login router
const adminRegRouter = require("./endpoints/admin/adminReg"); // Import the admin registration router
const approveAdminRouter = require("./endpoints/admin/approveAdmin"); // Import the admin approval router
const adminDashboardDataRouter = require("./endpoints/admin/adminDashboardData"); // Import the admin dashboard data router
const manageUsersRouter = require("./endpoints/admin/manageUsers"); // Import the manageUsers router
const leadMagnateRouter = require("./endpoints/leadMagnate"); // Import the leadMagnate router

const app = express();
const port = process.env.PORT || 5001;
const pool = createDatabaseConnection();
app.set("pool", pool);

//stripe webhook router defined before CORS middleware to ensure it can handle raw body parsing
app.use('/webhook', express.raw({ type: 'application/json' }), stripeWebhookRouter);

// --- Middleware and Cors---
const whitelist = [
  "https://app.mypropertypal.com", // Production frontend
  "https://admin.mypropertypal.com", // Admin panel
  "https://www.mypropertypal.com/", //landing page
  "http://localhost:3000", // Local development
];

// Configure CORS middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Check if the origin is in the whitelist
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Public Routes ---
app.use('/api/chat', chatRoute);
app.post('/login', (req, res) => login(req, res, pool));
app.use('/register', register);
app.use('/api/stripe', stripeRouter);
app.use("/api/account/reset-password", resetPasswordRouter);
app.use("/api/leads", leadMagnateRouter); // Mount the leadMagnate router

//the admin login route
app.use("/api/admin", adminLoginRouter); // Mount the admin login router
app.use("/api/admin", adminRegRouter); // Mount the admin registration router
app.use("/api/admin", approveAdminRouter); // Mount the admin approval router

app.get('/external-api', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

app.get('/api/contractors', async (req, res) => {
  const { location, keyword } = req.query;
  if (!location) {
    return res.status(400).json({ error: "Missing required 'location' query parameter." });
  }
  try {
    const results = await searchContractors(location, keyword);
    res.json({ contractors: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contractors' });
  }
});

// --- Tenant Invite Endpoint (public, no auth) ---
app.get('/api/tenants/invite/:token', async (req, res) => {
  const pool = req.app.get("pool");
  const { token } = req.params;
  const result = await pool.query(
    `SELECT a.first_name, a.last_name, a.email, 'tenant' AS role
     FROM tenant t
     JOIN account a ON t.account_id = a.id
     WHERE t.invite_token = $1 AND t.is_pending = TRUE`,
    [token]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Invalid or expired invite." });
  }
  res.json(result.rows[0]);
});

// --- Protected Routes ---
// Apply authentication middleware for all other routes
app.use(authenticate);
app.use(checkSubscriptionStatus);

//account 
app.use('/api/account', accountRouter);

// Register the cancelAccount route
app.use('/api/subscriptions', cancelAccountRouter);

// Dashboard endpoints (now protected)
app.use('/api/dashboard', dashRouter(pool));

// Properties endpoints (protected)
app.use('/api/properties', propertiesRouter);
app.use("/api/tenants", tenantsRouter);
app.use('/api/finances', financesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/tenant/rent', tenantRentRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/messages', messagesRouter);

// admin routes
app.use("/api/admin/dashboard", authenticate, adminDashboardDataRouter);
app.use("/api/admin/manage-users", authenticate, manageUsersRouter);

// --- Static Exports ---
app.use("/exports", express.static(path.join(__dirname, "../exports")));

// --- Catch-all route ---
app.get('*', (req, res) => res.status(404).send('Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));
