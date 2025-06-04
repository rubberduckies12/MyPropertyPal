// filepath: /Users/tommyrowe/Documents/PropertyApp/propertyapp-backend/test-mongo.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/propertyapp')
  .then(() => {
    console.log('Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });