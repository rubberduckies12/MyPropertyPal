import React, { useState } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import ReactStars from "react-rating-stars-component";

const API_BASE = "https://mypropertypal-3.onrender.com";

const RECOMMENDED_KEYWORDS = [
  "plumber",
  "electrician",
  "builder",
  "roofer",
  "painter",
  "carpenter",
  "handyman",
  "heating engineer",
  "locksmith"
];

async function fetchContractors(location, keyword = "contractor") {
  const params = new URLSearchParams({ location, keyword });
  try {
    const response = await fetch(`${API_BASE}/api/contractors?${params.toString()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.contractors || [];
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return [];
  }
}

export default function ContractorsPage() {
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const contractors = await fetchContractors(location, keyword || "contractor");
      setResults(contractors);
      if (contractors.length === 0) setError("No contractors found. Try a different search.");
    } catch {
      setError("Could not fetch contractors. Please try again.");
    }
    setLoading(false);
  };

  const getGoogleMapsUrl = (placeId) =>
    `https://www.google.com/maps/place/?q=place_id:${placeId}`;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Find Home Improvement Professionals</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto mb-8 border border-blue-100">
          <form className="flex flex-col sm:flex-row gap-4 items-center" onSubmit={handleSearch}>
            <input
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Enter your location (e.g. London, UK)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
            <input
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Type of contractor (e.g. plumber)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              list="recommended-keywords"
            />
            <datalist id="recommended-keywords">
              {RECOMMENDED_KEYWORDS.map((kw) => (
                <option value={kw} key={kw} />
              ))}
            </datalist>
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition min-w-[120px]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="font-semibold text-black">Recommended:</span>
            {RECOMMENDED_KEYWORDS.map((kw) => (
              <button
                key={kw}
                className="bg-blue-50 text-blue-700 font-semibold rounded-lg px-3 py-1 border border-blue-100 hover:bg-blue-100 transition"
                type="button"
                onClick={() => setKeyword(kw)}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="w-full overflow-x-auto mt-8">
          <table className="min-w-[900px] w-full bg-white rounded-2xl text-base divide-y divide-blue-100">
            <thead>
              <tr>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Name</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Address</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Rating</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Google Maps</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-8">
                    No contractors found
                  </td>
                </tr>
              ) : (
                results.map((c, idx) => (
                  <tr
                    key={c.place_id || idx}
                    className="hover:bg-blue-50 transition cursor-pointer"
                  >
                    <td className="py-4 px-3 font-semibold text-blue-700">{c.name}</td>
                    <td className="py-4 px-3 text-black">{c.address}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <ReactStars
                          count={5}
                          value={Number(c.rating) || 0}
                          size={22}
                          isHalf={true}
                          edit={false}
                          activeColor="#fbbf24"
                        />
                        <span className="text-black">
                          {c.rating ? `${c.rating} (${c.user_ratings_total} reviews)` : "No rating"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <a
                        href={getGoogleMapsUrl(c.place_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition inline-block"
                        title="View on Google Maps"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}