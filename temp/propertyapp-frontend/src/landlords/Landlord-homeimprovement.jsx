import React, { useState } from "react";
import axios from "axios";

// Suggested issues and contractor types for quick selection
const SUGGESTED_TERMS = [
  { issue: "Leaking pipe", contractor: "plumber" },
  { issue: "No heating", contractor: "hvac contractor" },
  { issue: "Broken boiler", contractor: "boiler repair" },
  { issue: "Electrical fault", contractor: "electrician" },
  { issue: "Roof leak", contractor: "roofing contractor" },
  { issue: "Broken window", contractor: "glazier" },
  { issue: "Blocked drain", contractor: "drain services" },
  { issue: "Pest problem", contractor: "pest control" },
  { issue: "Broken lock", contractor: "locksmith" },
  { issue: "General repairs", contractor: "handyman" },
];

const LandlordHomeImprovement = () => {
  // -------------------- State --------------------
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [suggestedContractor, setSuggestedContractor] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------- Handlers --------------------
  // Suggest contractor type based on issue input
  const handleIssueChange = (e) => {
    const val = e.target.value;
    setIssue(val);
    const found = SUGGESTED_TERMS.find(
      (item) => val.toLowerCase().includes(item.issue.toLowerCase())
    );
    setSuggestedContractor(found ? found.contractor : "");
  };

  // Handle quick suggestion button click
  const handleSuggestionClick = (contractor, issue) => {
    setIssue(issue);
    setSuggestedContractor(contractor);
  };

  // Search for contractors using backend API
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      // Use the suggested contractor if available, otherwise use the issue as the search term
      const term = suggestedContractor || issue;
      const res = await axios.get("/api/search-contractors", {
        params: {
          term,
          location,
        },
      });
      setResults(res.data.results || []);
    } catch (err) {
      setError("Failed to fetch contractors. Please try again.");
    }
    setLoading(false);
  };

  // -------------------- Render --------------------
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Find a Contractor for Your Home Issue
      </h1>
      {/* Search Form */}
      <form className="flex flex-col gap-4 mb-8" onSubmit={handleSearch}>
        <input
          className="border rounded-lg px-4 py-2"
          type="text"
          placeholder="Describe your issue (e.g. leaking pipe, no heating)"
          value={issue}
          onChange={handleIssueChange}
          required
        />
        <input
          className="border rounded-lg px-4 py-2"
          type="text"
          placeholder="Location (e.g. Belfast, BT1)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        {suggestedContractor && (
          <div className="text-green-700 text-sm">
            Suggested contractor:{" "}
            <span className="font-semibold">{suggestedContractor}</span>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {/* Quick Suggestions */}
      <div className="mb-6">
        <div className="text-gray-600 mb-2">Quick suggestions:</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TERMS.map((item) => (
            <button
              key={item.issue}
              type="button"
              className="bg-gray-200 hover:bg-blue-100 text-sm px-3 py-1 rounded"
              onClick={() => handleSuggestionClick(item.contractor, item.issue)}
            >
              {item.issue}
            </button>
          ))}
        </div>
      </div>
      {/* Error Message */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Results */}
      <div>
        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended Contractors</h2>
            <ul className="space-y-4">
              {results.map((biz) => (
                <li key={biz.place_id} className="border rounded-lg p-4 shadow">
                  <div className="font-bold text-lg">{biz.name}</div>
                  <div className="text-gray-700">{biz.formatted_address}</div>
                  {biz.types && (
                    <div className="text-gray-500">{biz.types.join(", ")}</div>
                  )}
                  {biz.rating && (
                    <div>
                      <span className="font-semibold">Rating:</span> {biz.rating} ⭐
                    </div>
                  )}
                  {biz.user_ratings_total && (
                    <div>
                      <span className="font-semibold">Reviews:</span> {biz.user_ratings_total}
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${biz.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Google Maps
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="text-gray-500">
            No results yet. Try describing your issue above.
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordHomeImprovement;