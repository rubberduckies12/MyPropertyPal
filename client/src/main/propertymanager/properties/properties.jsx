import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./properties.css";

const API_BASE = "http://localhost:5001";

export default function Properties() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyNotes, setPropertyNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch properties from backend
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/properties`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === "401") {
          setError("You must be logged in to view properties.");
        } else if (err.message === "403") {
          setError("You do not have permission to view these properties.");
        } else if (err.message === "404") {
          setError("Properties endpoint not found.");
        } else {
          setError(err.message || "Error loading properties");
        }
        setLoading(false);
      });
  }, []);

  // Handlers
  const handleRowClick = (property) => {
    setSelectedProperty(property);
    setNoteInput("");
  };
  const handleCloseNotesModal = () => setSelectedProperty(null);
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setPropertyNotes((prev) => ({
      ...prev,
      [selectedProperty.name]: [
        ...(prev[selectedProperty.name] || []),
        { text: noteInput, date: new Date().toLocaleString() },
      ],
    }));
    setNoteInput("");
  };

  // Add Property Form State
  const [addForm, setAddForm] = useState({
    name: "",
    address: "",
    city: "",
    county: "",
    postcode: "",
    rent_amount: "",
    status: "Available",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddFormChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add property");
      }
      setShowAddModal(false);
      setAddForm({
        name: "",
        address: "",
        city: "",
        county: "",
        postcode: "",
        rent_amount: "",
        status: "Available",
      });
      // Refresh property list with JWT header
      setLoading(true);
      fetch(`${API_BASE}/api/properties`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            let errorMsg = "Failed to fetch properties";
            try {
              const data = await res.json();
              errorMsg = data.error || errorMsg;
            } catch {
              errorMsg = `Error: ${res.status}`;
            }
            throw new Error(errorMsg);
          }
          return res.json();
        })
        .then((data) => {
          setProperties(data.properties || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Error loading properties");
          setLoading(false);
        });
    } catch (err) {
      setAddError(err.message);
      setAddLoading(false);
    }
  };

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h1 className="properties-title">Your Properties</h1>
          <button
            className="add-property-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Property
          </button>
        </div>

        {loading && <div>Loading properties...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Table layout */}
        {!loading && !error && (
          <div className="properties-table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Tenant</th>
                  <th>Monthly Rent</th>
                  <th>Next Rent Due</th>
                </tr>
              </thead>
              <tbody>
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No properties found.
                    </td>
                  </tr>
                )}
                {properties.map((prop, idx) => (
                  <tr
                    key={idx}
                    className="property-row"
                    onClick={() => handleRowClick(prop)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{prop.name || "-"}</td>
                    <td>{prop.address || "-"}</td>
                    <td>
                      <span className={`property-status status-${prop.status?.toLowerCase().replace(/\s/g, "-")}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td>{prop.leadTenant || "No tenant"}</td>
                    <td>{prop.rent || "N/A"}</td>
                    <td>{prop.nextRentDue || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="add-property-modal">
            <div className="add-property-modal-content">
              <h2>Add Property</h2>
              <form onSubmit={handleAddProperty}>
                <label>
                  Name
                  <input
                    name="name"
                    value={addForm.name}
                    onChange={handleAddFormChange}
                    required
                  />
                </label>
                <label>
                  Address
                  <input
                    name="address"
                    value={addForm.address}
                    onChange={handleAddFormChange}
                    required
                  />
                </label>
                <label>
                  City
                  <input
                    name="city"
                    value={addForm.city}
                    onChange={handleAddFormChange}
                    required
                  />
                </label>
                <label>
                  County
                  <input
                    name="county"
                    value={addForm.county}
                    onChange={handleAddFormChange}
                  />
                </label>
                <label>
                  Postcode
                  <input
                    name="postcode"
                    value={addForm.postcode}
                    onChange={handleAddFormChange}
                    required
                  />
                </label>
                <label>
                  Monthly Rent (£)
                  <input
                    name="rent_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.rent_amount}
                    onChange={handleAddFormChange}
                    required
                  />
                </label>
                <label>
                  Status
                  <select
                    name="status"
                    value={addForm.status}
                    onChange={handleAddFormChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </label>
                {addError && <div style={{ color: "red" }}>{addError}</div>}
                <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                  <button type="submit" className="add-note-btn" disabled={addLoading}>
                    {addLoading ? "Adding..." : "Add Property"}
                  </button>
                  <button
                    type="button"
                    className="close-notes-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Property Notes Modal (card style) */}
        {selectedProperty && (
          <div className="property-notes-modal">
            <div className="property-notes-modal-content">
              <h2>
                Notes for {selectedProperty.name}
              </h2>
              <div className="property-info">
                <div>
                  <strong>Address:</strong> {selectedProperty.address}
                </div>
                <div>
                  <strong>Status:</strong> {selectedProperty.status}
                </div>
                <div>
                  <strong>Lead Tenant:</strong> {selectedProperty.leadTenant || "No tenant"}
                </div>
                <div>
                  <strong>Rental Income:</strong> {selectedProperty.rent || "N/A"}
                </div>
                <div>
                  <strong>Next Rent Due:</strong> {selectedProperty.nextRentDue || "N/A"}
                </div>
              </div>
              <div className="property-notes-list">
                {(propertyNotes[selectedProperty.name] || []).length === 0 && (
                  <p>No notes yet.</p>
                )}
                {(propertyNotes[selectedProperty.name] || []).map((note, idx) => (
                  <div key={idx} className="property-note">
                    <div>{note.text}</div>
                    <div className="property-note-date">{note.date}</div>
                  </div>
                ))}
              </div>
              <textarea
                className="property-note-input"
                placeholder="Add a note or event..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                <button onClick={handleAddNote} className="add-note-btn">
                  Add Note
                </button>
                <button onClick={handleCloseNotesModal} className="close-notes-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}