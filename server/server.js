require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
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
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

const port = 5000;

const pool = createDatabaseConnection();

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