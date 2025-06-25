const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

// Stripe webhook route must use express.raw BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Import and use routes
const propertyRoutes = require('./routes/property-route.js');
const userRoutes = require('./routes/user-route.js');
const documentRoutes = require('./routes/document-route.js');
const calendereventRoutes = require('./routes/calenderevent-route');
const messageRoutes = require('./routes/Message-route.js');
const incidentRoutes = require('./routes/Incident-route.js');
const paymentRoutes = require('./routes/Payment-routes.js');
const aiChatRoutes = require('./routes/ai-chat');
const contractorSearchRoutes = require('./routes/contractor-search');

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/calenderevent', calendereventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiChatRoutes);
app.use('/api', contractorSearchRoutes);

app.get('/', (req, res) => {
  res.send('PropertyApp backend running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));