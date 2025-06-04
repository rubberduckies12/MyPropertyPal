const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/search-contractors', async (req, res) => {
  const { term, location } = req.query;
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `${term} in ${location}`,
          key: GOOGLE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contractors' });
  }
});

module.exports = router;