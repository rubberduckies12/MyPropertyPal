require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { Pool } = require("pg");

const createDatabaseConnection = require('./assets/databaseConnect');
const login = require('./endpoints/login');
const register = require('./endpoints/register');
const dashEndpoints = require('./endpoints/dash.js');
const { getProperties, addProperty, deleteProperty } = require('./endpoints/properties.js');
const authenticate = require('./middleware/authenticate');

const app = express();
const port = 5001;
const pool = createDatabaseConnection();

app.set("pool", pool);

const chatRoute = require('./endpoints/chat');
const tenantsRouter = require('./endpoints/tenants');
const propertiesRouter = require('./endpoints/properties');
const financesRouter = require('./endpoints/finances');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
}));
app.use(express.json());
app.use('/api/chat', chatRoute);

// Example: Using axios in a route
app.get('/external-api', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

// Contractors API
const { searchContractors } = require('./database/getcontractors');
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

// Auth endpoints
app.post('/login', (req, res) => login(req, res, pool));
app.post('/register', (req, res) => register(req, res, pool));

// Dashboard endpoints
dashEndpoints(app, pool);

// Properties endpoint (JWT protected)
app.get('/api/properties', authenticate, (req, res) => getProperties(req, res, pool));
app.post('/api/properties', authenticate, (req, res) => addProperty(req, res, pool));
app.delete('/api/properties/:id', authenticate, (req, res) => deleteProperty(req, res, pool));

// Mount the tenants API with authentication and pool
app.use(
  '/api/tenants',
  authenticate,
  (req, res, next) => {
    req.app.set("pool", pool);
    next();
  },
  tenantsRouter
);

app.use('/api/finances', financesRouter);

// Serve static files from the "exports" directory
app.use("/exports", express.static(path.join(__dirname, "../exports")));

// Client Endpoints (placeholders)
app.get('/', (req, res) => res.send('Welcome to the Property Management API'));
app.get('/login', (req, res) => res.send('Login page placeholder'));
app.get('/register', (req, res) => res.send('Register page placeholder'));
app.get('/landing-page', (req, res) => res.send('Landing page placeholder'));

// Catch-all route
app.get('*', (req, res) => res.status(404).send('Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));
