require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

const port = 5000;

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABSE_HOST,
    database: process.env.DATABSE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABSE_PORT,
});

// API Endpoints

// Login / Register Page

//Client Endpoints
app.get('/', (req, res) => {});
app.get('/login', (req, res) => {});
app.get('/register', (req, res) => {});
app.get('/landing-page', (req, res) => {});

app.get('*', (req, res) => {});

app.listen(port, () => console.log(`Server running on port ${port}`));