import React, { useState } from "react";
import Sidebar from "../sidebar/sidebar.jsx";
import "./properties.css";

export default function Properties() {
  // ===== State Management =====
  const [showAddModal, setShowAddModal] = useState(false); // Controls add property modal
  const [selectedProperty, setSelectedProperty] = useState(null); // Property selected for notes modal
  const [propertyNotes, setPropertyNotes] = useState({}); // Stores notes per property
  const [noteInput, setNoteInput] = useState(""); // Input for new note

  // Sample property data (replace with API data in production)
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

  // ===== Handlers =====

  // Open notes modal for a property
  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setNoteInput("");
  };

  // Close notes modal
  const handleCloseNotesModal = () => {
    setSelectedProperty(null);
  };

  // Add a note to the selected property
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

  // Change property status (updates both modal and main list)
  const handleStatusChange = (newStatus) => {
    setSelectedProperty((prev) => ({ ...prev, status: newStatus }));
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedProperty.id ? { ...p, status: newStatus } : p
      )
    );
  };

  // ===== Render =====
  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        {/* Header with title and add property button */}
        <div className="properties-header">
          <h1 className="properties-title">Your Properties</h1>
          <button
            className="add-property-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Property
          </button>
        </div>

        {/* Property cards list */}
        <div className="properties-list">
          {properties.map((prop) => (
            <div
              className="property-card"
              key={prop.id}
              onClick={() => handleCardClick(prop)}
              style={{ cursor: "pointer" }}
            >
              {/* 1. Property Name or Address */}
              <div className="property-title-bar">
                {`${prop.address}, ${prop.city}, ${prop.county}, ${prop.postcode}`}
              </div>
              {/* 2. Monthly Rent Amount */}
              <div className="property-card-row">
                <span className="property-label">Monthly Rent:</span>
                <span className="property-value">
                  {prop.rent_amount ? `£${prop.rent_amount}` : "N/A"}
                </span>
              </div>
              {/* 3. Unit Status */}
              <div className="property-card-row">
                <span className="property-label">Status:</span>
                <span className={`property-status status-${prop.status.toLowerCase().replace(/\s/g, "-")}`}>
                  {prop.status}
                </span>
              </div>
              {/* 4. Next Rent Due Date */}
              <div className="property-card-row">
                <span className="property-label">Next Rent Due:</span>
                <span className="property-value">
                  {prop.nextRentDue ? prop.nextRentDue : "N/A"}
                </span>
              </div>
              {/* 5. Tenant Name */}
              <div className="property-card-row">
                <span className="property-label">Tenant:</span>
                <span className="property-value">
                  {prop.leadTenant
                    ? `${prop.leadTenant.first_name} ${prop.leadTenant.last_name}`
                    : "No tenant assigned"}
                </span>
              </div>
              {/* 6. Maintenance Issue */}
              <div className="property-card-row">
                <span className="property-label">Maintenance:</span>
                <span className="property-value">
                  {prop.maintenanceIssue ? prop.maintenanceIssue : "None"}
                </span>
              </div>
              {/* 7. ROI */}
              <div className="property-card-row">
                <span className="property-label">ROI:</span>
                <span className="property-value">
                  {prop.roi ? prop.roi : "N/A"}
                </span>
              </div>
            </div>
          ))}
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

        {/* Property Notes Modal */}
        {selectedProperty && (
          <div className="property-notes-modal">
            <div className="property-notes-modal-content">
              <h2>
                Notes for {selectedProperty.number} {selectedProperty.name}
              </h2>
              {/* Property info section */}
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
                {/* Show tenant info if occupied */}
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
              </div>
              {/* Notes list */}
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
              {/* Add note input */}
              <textarea
                className="property-note-input"
                placeholder="Add a note or event..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <div style={{ marginTop: 12 }}>
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