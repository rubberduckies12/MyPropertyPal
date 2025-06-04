const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

router.get('/', async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

router.post('/', async (req, res) => {
  const property = new Property(req.body);
  await property.save();
  res.json(property);
});

module.exports = router;