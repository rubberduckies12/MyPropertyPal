require('dotenv').config();
const axios = require('axios');

/**
 * Search for local contractors using Google Places API.
 * @param {string} location - The location to search near (e.g., "London, UK" or "51.5074,-0.1278").
 * @param {string} [keyword="contractor"] - The contractor type or keyword.
 * @returns {Promise<Array>} - List of contractors found.
 */
async function searchContractors(location, keyword = "contractor") {
  const apiKey = process.env.GOOGLE_API_KEY;
  const endpoint = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const params = {
    query: `${keyword} near ${location}`,
    key: apiKey,
  };

  try {
    const response = await axios.get(endpoint, { params });
    if (response.data && response.data.results) {
      // Return simplified contractor info
      return response.data.results.map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        place_id: place.place_id,
        types: place.types,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching contractors:", error.message);
    return [];
  }
}

// Example usage (remove or adapt for your app/server):
// searchContractors("London, UK").then(console.log);

module.exports = { searchContractors };