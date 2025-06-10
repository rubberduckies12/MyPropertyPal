require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // <-- Import axios

// Importing Assets
const createDatabaseConnection = require('./assets/databaseConnect');

// Importing Endpoints
const login = require('./endpoints/login');
const register = require('./endpoints/register');

const app = express();
const port = 5001;

// Create and attach the database pool
const pool = createDatabaseConnection();

const chatRoute = require('./endpoints/chat');

app.use(cors());
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

// API Endpoints

// Login / Register Page
app.post('/login', (req, res) => login(req, res, pool));
app.post('/register', (req, res) => register(req, res, pool));

// Client Endpoints (placeholders)
app.get('/', (req, res) => res.send('Welcome to the Property Management API'));
app.get('/login', (req, res) => res.send('Login page placeholder'));
app.get('/register', (req, res) => res.send('Register page placeholder'));
app.get('/landing-page', (req, res) => res.send('Landing page placeholder'));

// Catch-all route
app.get('*', (req, res) => res.status(404).send('Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));
