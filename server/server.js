require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importing only the chat endpoint
const chatRoute = require('./endpoints/chat');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Chatbot endpoint
app.use('/api/chat', chatRoute);

// Catch-all: serve index.html for any other route (for React Router)


app.listen(port, () => console.log(`Server running on port ${port}`));