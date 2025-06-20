/**
 * Fetch contractors from the backend API.
 * @param {string} location - The location to search (e.g., "London, UK").
 * @param {string} [keyword="contractor"] - The contractor type or keyword.
 * @returns {Promise<Array>} - Resolves to an array of contractor objects.
 */
async function fetchContractors(location, keyword = "contractor") {
  const params = new URLSearchParams({ location, keyword });
  // Hardcode the backend URL (adjust port if needed)
  const backendUrl = "http://localhost:5001/api/contractors";
  try {
    const response = await fetch(`${backendUrl}?${params.toString()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.contractors || [];
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return [];
  }
}

// Example usage (for testing, remove in production):
// fetchContractors("London, UK", "plumber").then(console.log);

export default fetchContractors;