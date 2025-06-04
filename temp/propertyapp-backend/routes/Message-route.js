const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Message = require('../models/message');
const auth = require('../middleware/auth');

// Protect all routes below this line
router.use(auth);

// Send a message (always use userId for fromUserId and toUserId)
router.post('/', async (req, res) => {
  try {
    // No need to check property relationship
    const message = new Message({
      messageId: uuidv4(),
      fromUserId: req.body.fromUserId, // should be userId string
      toUserId: req.body.toUserId,     // should be userId string
      content: req.body.content,
      timestamp: new Date()
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get conversation between two users
router.get('/conversation', async (req, res) => {
  const { userA, userB } = req.query;
  try {
    // No need to check property relationship
    const messages = await Message.find({
      $or: [
        { fromUserId: userA, toUserId: userB },
        { fromUserId: userB, toUserId: userA }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected route example
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

module.exports = router;