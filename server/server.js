require('dotenv').config(); // <-- add this as the first line
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importing Assets
const createDatabaseConnection = require('./assets/databaseConnect');

// Importing Endpoints
const login = require('./endpoints/login');
const register = require('./endpoints/register');
const forgetPassword = require('./endpoints/forgetPassword');
const verifyEmail = require('./endpoints/verifyEmail');

const app = express();
const port = 5001;

const chatRoute = require('./endpoints/chat');

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoute);

app.get('/test', (req, res) => res.send('OK'));

app.listen(port, () => console.log(`Server running on port ${port}`));

// API Endpoints

// Login / Register Page
app.post('/login', async (req, res) => login(req, res, pool));
app.post('/forget-password', async (req, res) => forgetPassword(req, res, pool));

app.post('/register', async (req, res) => register(req, res, pool));
app.get('/verify-email/:emailToken',async (req, res) => verifyEmail(req, res, pool));

//Client Endpoints
app.get('/', (req, res) => {});
app.get('/login', (req, res) => {});
app.get('/register', (req, res) => {});
app.get('/landing-page', (req, res) => {});

app.get('*', (req, res) => {});

app.listen(port, () => console.log(`Server running on port ${port}`));
