const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required.' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Return just the reply for your frontend
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'OpenAI API error' });
  }
});

module.exports = router;