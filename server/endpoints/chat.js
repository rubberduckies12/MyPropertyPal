const express = require('express');
const router = express.Router();
const axios = require('axios');

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are a helpful assistant for a property management platform.
You only answer questions related to property, real estate, renting, buying, selling, or managing property.
If a user asks about anything unrelated to property, politely decline.
Never mention or discuss any competitors or other property platforms.
When providing lists or steps, use Markdown formatting:
- Numbered lists (1., 2., 3.)
- Bullet points (-, *, or •)
- Use **bold** or *italics* for emphasis if appropriate.
- Capitalize the first letter of each list item or step.
- Always finish your response clearly.`
};

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    // Always prepend the system prompt
    const fullMessages = [SYSTEM_PROMPT, ...messages];
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    const errorMsg = err.response?.data
      ? JSON.stringify(err.response.data)
      : err.message || String(err);
    console.error('OpenAI API error:', errorMsg);
    res.status(500).json({ error: 'OpenAI API error', details: errorMsg });
  }
});

module.exports = router;