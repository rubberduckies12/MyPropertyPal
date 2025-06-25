const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const mongoose = require('mongoose'); // Add this at the top if not already imported

// Protect all routes below this line
router.use(auth);

// Get all properties for landlord
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ landlordId: req.user.userId });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a property (landlord creates property, landlordId set from session/auth)
router.post('/', async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: landlord not authenticated.' });
    }
    const property = new Property({
      ...req.body,
      propertyId: uuidv4(), // 6-digit or UUID propertyId
      landlordId: req.user.userId
    });
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a property (by propertyId and landlordId)
router.patch('/:propertyId', async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId: req.params.propertyId, landlordId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!property) return res.status(403).json({ error: 'Forbidden: Not your property.' });
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a property (by propertyId and landlordId)
router.delete('/:propertyId', async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      propertyId: req.params.propertyId,
      landlordId: req.user.userId
    });
    res.json({ message: property ? 'Property deleted successfully.' : 'Property not found.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign or unassign a tenant to a property (always use tenant.userId, and propertyId)
router.patch('/:id/tenant', async (req, res) => {
  try {
    let update = {};
    let tenant = null;

    // Always look up by userId (6-digit) first
    if (req.body.tenantId) {
      tenant = await User.findOne({ userId: req.body.tenantId });
      if (!tenant) return res.status(404).json({ error: 'Tenant not found.' });
      update.tenantId = tenant.userId;
      await User.findByIdAndUpdate(tenant._id, { linkedLandlordId: req.user.userId });
    } else {
      update.tenantId = null;
    }

    const property = await Property.findOneAndUpdate(
      { propertyId: req.params.id, landlordId: req.user.userId },
      update,
      { new: true }
    );
    if (!property) return res.status(403).json({ error: 'Forbidden: Not your property.' });

    // --- NEW: Create a payment when a tenant is assigned ---
    if (tenant && property && property.rent && req.body.tenantId) {
      // Only create a payment if one doesn't already exist for this property/tenant/period
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0,0,0,0);

      const existingPayment = await Payment.findOne({
        propertyId: property.propertyId,
        tenantId: tenant.userId,
        dueDate: { $gte: startOfMonth }
      });

      if (!existingPayment) {
        await Payment.create({
          paymentId: require('uuid').v4(),
          propertyId: property.propertyId,
          tenantId: tenant.userId,
          landlordId: property.landlordId,
          amount: property.rent,
          dueDate: startOfMonth, // or set to next rent due date logic
          status: 'unpaid'
        });
      }
    }
    // ------------------------------------------------------

    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update rent (standardize on monthlyRent)
router.patch('/:id/rent', async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId: req.params.id, landlordId: req.user.userId },
      { monthlyRent: req.body.rent },
      { new: true }
    );
    if (!property) return res.status(403).json({ error: 'Forbidden: Not your property.' });
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update lease end date
router.patch('/:id/lease-end', async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId: req.params.id, landlordId: req.user.userId },
      { leaseEnd: req.body.leaseEnd },
      { new: true }
    );
    if (!property) return res.status(403).json({ error: 'Forbidden: Not your property.' });
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get property for a tenant (by userId)
router.get('/tenant', async (req, res) => {
  try {
    const property = await Property.findOne({ tenantId: req.user.userId });
    if (!property) return res.status(404).json({ error: 'No property assigned.' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;