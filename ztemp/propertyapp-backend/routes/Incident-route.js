const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Incident = require('../models/Incident');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// Protect all routes below this line
router.use(auth);

// Create an incident (always use userId for tenantId and landlordId)
router.post('/', async (req, res) => {
  try {
    // Find the property to get correct landlordId if not provided
    let landlordId = req.body.landlordId;
    if (!landlordId && req.body.propertyId) {
      const property = await Property.findOne({ propertyId: req.body.propertyId });
      if (property) landlordId = property.landlordId;
    }
    const incident = new Incident({
      incidentId: uuidv4(),
      tenantId: req.body.tenantId, // should be 6-digit userId string
      propertyId: req.body.propertyId,
      landlordId: landlordId,
      description: req.body.description,
      severity: 'yellow', // default, landlord can update
      status: 'open',     // default status
      createdAt: new Date()
    });
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Landlord or tenant confirms closed status
router.patch('/:id', async (req, res) => {
  try {
    const update = {};
    if (req.body.severity) update.severity = req.body.severity; // 'red', 'yellow', 'green'
    if (req.body.status) update.status = req.body.status;       // 'open', 'closed'
    if (typeof req.body.tenantConfirmedClosed === 'boolean') update.tenantConfirmedClosed = req.body.tenantConfirmedClosed;
    if (typeof req.body.landlordConfirmedClosed === 'boolean') update.landlordConfirmedClosed = req.body.landlordConfirmedClosed;

    const incident = await Incident.findOneAndUpdate(
      { incidentId: req.params.id },
      update,
      { new: true }
    );
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    // If both parties have confirmed closed, delete the incident
    if (incident.status === 'closed' && incident.tenantConfirmedClosed && incident.landlordConfirmedClosed) {
      await Incident.deleteOne({ incidentId: req.params.id });
      return res.json({ message: 'Incident closed and deleted by agreement.' });
    }

    res.json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all incidents for a property, landlord, or tenant (only if related)
router.get('/', async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only show incidents where the user is the tenant or landlord (by userId)
  const filter = {
    $or: [
      { tenantId: req.user.userId },
      { landlordId: req.user.userId }
    ]
  };

  // Optional: further filter by propertyId if provided
  if (req.query.propertyId) filter.propertyId = req.query.propertyId;

  try {
    const incidents = await Incident.find(filter).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an incident (only by the tenant who posted it)
router.delete('/:incidentId', async (req, res) => {
  try {
    // Find the incident by incidentId
    const incident = await Incident.findOne({ incidentId: req.params.incidentId });
    if (!incident) return res.status(404).json({ error: 'Incident not found.' });

    // Check if the requester is the tenant who posted it (by userId)
    if (incident.tenantId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own incidents.' });
    }

    await Incident.deleteOne({ incidentId: req.params.incidentId });
    res.json({ message: 'Incident deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;