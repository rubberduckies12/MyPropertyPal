require('dotenv').config(); // <-- add this as the first line
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

const chatRoute = require('./endpoints/chat');

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoute);

app.get('/test', (req, res) => res.send('OK'));

app.listen(port, () => console.log(`Server running on port ${port}`));

