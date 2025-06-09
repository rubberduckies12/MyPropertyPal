const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required.' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    // Return the full response, like your old route
    res.json(completion);
  } catch (error) {
    console.error('OpenAI API error:', error?.message || error);
    res.status(500).json({ error: 'OpenAI API error' });
  }
});

module.exports = router;
