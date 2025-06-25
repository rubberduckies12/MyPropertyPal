const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const CalendarEvent = require('../models/CalendarEvent');
const auth = require('../middleware/auth');

// Public routes here (if any)

// Protect all routes below this line
router.use(auth);

// Create a new calendar event (landlord posts)
router.post('/', async (req, res) => {
  try {
    const event = new CalendarEvent({
      eventId: uuidv4(),
      landlordId: req.body.landlordId,
      tenantId: req.body.tenantId,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      duration: req.body.duration,
      status: 'pending', // pending, accepted, proposed
      proposedDate: null,
      proposedTime: null,
      createdAt: new Date()
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tenant proposes a new time/date
router.post('/:eventId/propose', async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ eventId: req.params.eventId });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.proposedDate = req.body.proposedDate;
    event.proposedTime = req.body.proposedTime;
    event.status = 'proposed';
    event.proposedAt = new Date();
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Landlord accepts proposed time/date
router.post('/:eventId/accept', async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ eventId: req.params.eventId });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.status === 'proposed') {
      event.date = event.proposedDate;
      event.time = event.proposedTime;
      event.status = 'accepted';
      event.acceptedAt = new Date();
      await event.save();
      return res.json(event);
    } else {
      return res.status(400).json({ error: 'No proposal to accept' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Auto-accept after 14 days (should be run by a scheduled job, but here's a manual endpoint for demo)
router.post('/:eventId/autoaccept', async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ eventId: req.params.eventId });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.status === 'proposed') {
      const now = new Date();
      const proposedAt = event.proposedAt || event.createdAt;
      const diffDays = (now - proposedAt) / (1000 * 60 * 60 * 24);
      if (diffDays >= 14) {
        event.date = event.proposedDate;
        event.time = event.proposedTime;
        event.status = 'accepted';
        event.acceptedAt = now;
        await event.save();
        return res.json(event);
      } else {
        return res.status(400).json({ error: '14 days have not passed yet' });
      }
    } else {
      return res.status(400).json({ error: 'No proposal to auto-accept' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all calendar events (only for the authenticated landlord or tenant)
router.get('/', async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only show events where the user is the tenant or landlord
  const filter = {
    $or: [
      { tenantId: req.user.userId },
      { landlordId: req.user.userId }
    ]
  };

  const events = await CalendarEvent.find(filter);
  res.json(events);
});

// Get all events for a specific landlord
router.get('/landlord/:landlordId', async (req, res) => {
  try {
    const events = await CalendarEvent.find({ landlordId: req.params.landlordId });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all events for a specific tenant
router.get('/tenant/:tenantId', async (req, res) => {
  try {
    const events = await CalendarEvent.find({ tenantId: req.params.tenantId });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a calendar event by MongoDB _id
router.delete('/:id', async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json({ message: 'Calendar event deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a calendar event by MongoDB _id
router.patch('/:id', async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;