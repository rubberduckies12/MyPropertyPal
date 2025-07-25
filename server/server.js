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

// Endpoint routers
const login = require('./endpoints/login');
const register = require('./endpoints/register');
const dashEndpoints = require('./endpoints/dash.js');
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

const app = express();
const port = process.env.PORT || 5001;
const pool = createDatabaseConnection();
app.set("pool", pool);

// --- Middleware ---
// CORS and cookies must be set before any routes
app.use(cors({
  origin: 'https://app.mypropertypal.com', // ✅ exact match only
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Public Routes ---
app.use('/api/chat', chatRoute);
app.post('/login', (req, res) => login(req, res, pool));
app.post('/register', (req, res) => register(req, res, pool));
//app.use('/api/account', accountRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/stripe', stripeWebhookRouter);

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
// Authenticate before any protected endpoints
app.use(authenticate);
app.use(checkSubscriptionStatus);

//account 
app.use('/api/account', accountRouter);

// Dashboard endpoints (now protected)
dashEndpoints(app, pool);

// Properties endpoints (protected)
app.use('/api/properties', propertiesRouter);
app.use("/api/tenants", tenantsRouter);
app.use('/api/finances', financesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/tenant/rent', tenantRentRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/messages', messagesRouter);
//app.use('/api/stripe', stripeRouter);

// --- Static Exports ---
app.use("/exports", express.static(path.join(__dirname, "../exports")));



// --- Catch-all route ---
app.get('*', (req, res) => res.status(404).send('Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));
