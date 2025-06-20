import React, { useState } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./properties.css";

export default function Properties() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyNotes, setPropertyNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");

  const [properties, setProperties] = useState([
    {
      id: 1,
      number: "12A",
      name: "Maple House",
      address: "123 Main St",
      city: "London",
      county: "Greater London",
      postcode: "E1 2AB",
      status: "Occupied",
      leadTenant: { first_name: "Alice", last_name: "Smith" },
      rent_amount: 1200.0,
      nextRentDue: "2024-07-01",
      maintenanceIssue: "",
      roi: "5.2%",
    },
    {
      id: 2,
      number: "7",
      name: "Oak Villa",
      address: "456 Oak Rd",
      city: "London",
      county: "Greater London",
      postcode: "E2 3CD",
      status: "Available",
    },
    {
      id: 3,
      number: "22",
      name: "Birch Cottage",
      address: "789 Birch Lane",
      city: "London",
      county: "Greater London",
      postcode: "E3 4EF",
      status: "Not Available",
    },
  ]);

  // Handlers (same as before)
  const handleRowClick = (property) => {
    setSelectedProperty(property);
    setNoteInput("");
  };
  const handleCloseNotesModal = () => setSelectedProperty(null);
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setPropertyNotes((prev) => ({
      ...prev,
      [selectedProperty.id]: [
        ...(prev[selectedProperty.id] || []),
        { text: noteInput, date: new Date().toLocaleString() },
      ],
    }));
    setNoteInput("");
  };
  const handleStatusChange = (newStatus) => {
    setSelectedProperty((prev) => ({ ...prev, status: newStatus }));
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedProperty.id ? { ...p, status: newStatus } : p
      )
    );
  };
  const handleRemoveProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelectedProperty(null);
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

        {/* Table layout */}
        <div className="properties-table-container">
          <table className="properties-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Status</th>
                <th>Tenant</th>
                <th>Monthly Rent</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr
                  key={prop.id}
                  className="property-row"
                  onClick={() => handleRowClick(prop)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{prop.name || "-"}</td>
                  <td>
                    {`${prop.address}, ${prop.city}, ${prop.county}, ${prop.postcode}`}
                  </td>
                  <td>
                    <span className={`property-status status-${prop.status?.toLowerCase().replace(/\s/g, "-")}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td>
                    {prop.leadTenant
                      ? `${prop.leadTenant.first_name} ${prop.leadTenant.last_name}`
                      : "No tenant"}
                  </td>
                  <td>
                    {prop.rent_amount ? `£${prop.rent_amount}` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="add-property-modal">
            <div className="add-property-modal-content">
              <h2>Add Property</h2>
              <p>This is a placeholder for the add property form.</p>
              <button onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* Property Notes Modal (card style) */}
        {selectedProperty && (
          <div className="property-notes-modal">
            <div className="property-notes-modal-content">
              <h2>
                Notes for {selectedProperty.number} {selectedProperty.name}
              </h2>
              <div className="property-info">
                <div>
                  <strong>Address:</strong> {selectedProperty.address},{" "}
                  {selectedProperty.city}, {selectedProperty.county},{" "}
                  {selectedProperty.postcode}
                </div>
                <div>
                  <strong>Status:</strong>
                  <select
                    value={selectedProperty.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ marginLeft: 8, padding: "4px 8px", borderRadius: 6 }}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
                {selectedProperty.status === "Occupied" &&
                  selectedProperty.leadTenant && (
                    <>
                      <div>
                        <strong>Lead Tenant:</strong>{" "}
                        {selectedProperty.leadTenant.first_name}{" "}
                        {selectedProperty.leadTenant.last_name}
                      </div>
                      <div>
                        <strong>Rental Income:</strong> £{selectedProperty.rent_amount}
                      </div>
                    </>
                  )}
                {/* Add these details */}
                <div>
                  <strong>Next Rent Due:</strong>{" "}
                  {selectedProperty.nextRentDue ? selectedProperty.nextRentDue : "N/A"}
                </div>
                <div>
                  <strong>Maintenance:</strong>{" "}
                  {selectedProperty.maintenanceIssue
                    ? selectedProperty.maintenanceIssue
                    : "None"}
                </div>
                <div>
                  <strong>ROI:</strong> {selectedProperty.roi ? selectedProperty.roi : "N/A"}
                </div>
              </div>
              <div className="property-notes-list">
                {(propertyNotes[selectedProperty.id] || []).length === 0 && (
                  <p>No notes yet.</p>
                )}
                {(propertyNotes[selectedProperty.id] || []).map((note, idx) => (
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
                <button
                  onClick={() => handleRemoveProperty(selectedProperty.id)}
                  className="remove-property-btn"
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  Remove Property
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}