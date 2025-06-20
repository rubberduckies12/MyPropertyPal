import React, { useState } from "react";
import fetchContractors from "./contractors.js";
import "./contractors.css";
import Sidebar from "../../sidebar/sidebar.jsx";
import ReactStars from "react-rating-stars-component";

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

const ContractorsPage = () => {
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

  // Helper to build Google Maps Place URL
  const getGoogleMapsUrl = (placeId) =>
    `https://www.google.com/maps/place/?q=place_id:${placeId}`;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="contractors-root" style={{ marginLeft: "260px" }}>
        <h1 className="contractors-title">Find Home Improvement Professionals</h1>
        <form className="contractors-search-form" onSubmit={handleSearch}>
          <input
            className="contractors-input"
            type="text"
            placeholder="Enter your location (e.g. London, UK)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
          <input
            className="contractors-input"
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
          <button className="contractors-btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="contractors-recommended">
          <span>Recommended: </span>
          {RECOMMENDED_KEYWORDS.map((kw) => (
            <button
              key={kw}
              className="contractors-recommended-btn"
              type="button"
              onClick={() => setKeyword(kw)}
            >
              {kw}
            </button>
          ))}
        </div>
        {error && <div className="contractors-error">{error}</div>}
        <ul className="contractors-results">
          {results.map((c, idx) => (
            <li className="contractors-result-card" key={c.place_id || idx}>
              <a
                href={getGoogleMapsUrl(c.place_id)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
                title="View on Google Maps"
              >
                <div className="contractors-result-name">{c.name}</div>
                <div className="contractors-result-address">{c.address}</div>
                <div className="contractors-result-rating">
                  <ReactStars
                    count={5}
                    value={Number(c.rating) || 0}
                    size={22}
                    isHalf={true}
                    edit={false}
                    activeColor="#fbbf24"
                  />
                  <span className="contractors-rating-number">
                    {c.rating ? `${c.rating} (${c.user_ratings_total} reviews)` : "No rating"}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContractorsPage;