import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./compliance.css";

const BACKEND_URL = "http://localhost:5001";

export default function Compliance() {
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [properties, setProperties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    property_id: "",
    name: "",
    description: "",
    due_date: "",
  });
  const [eventSuccess, setEventSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const fileInputRef = useRef();

  // Fetch compliance events, documents, and properties from backend using only JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No login token found. Please log in again.");
      return;
    }

    fetch(`${BACKEND_URL}/api/compliance/events`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDeadlines(data))
      .catch(() => setError("Failed to load deadlines"));

    fetch(`${BACKEND_URL}/api/compliance/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(() => setError("Failed to load documents"));

    fetch(`${BACKEND_URL}/api/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then(data => setProperties(data.properties || []))
      .catch(() => setError("Failed to load properties"));
  }, []);

  // Upload & scan compliance document
  const handleUpload = async (e) => {
    setError("");
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/documents/upload`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Re-fetch documents after upload
        fetch(`${BACKEND_URL}/api/compliance/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => setDocuments(data));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  };

  // Add compliance event (no landlord_id in frontend)
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setEventSuccess("");
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setEventSuccess("Compliance event added!");
        setNewEvent({ property_id: "", name: "", description: "", due_date: "" });
        setShowEventForm(false);
        // Re-fetch events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
          .then(res => res.json())
          .then(data => setDeadlines(data));
      } else {
        setError("Failed to add event");
      }
    } catch {
      setError("Failed to add event");
    }
  };

  // Edit event handler
  const handleEditEvent = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events/${editEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(editEvent),
      });
      if (res.ok) {
        setEventSuccess("Event updated!");
        setEditEvent(null);
        setSelectedEvent(null);
        // Refresh events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
          .then(res => res.json())
          .then(data => setDeadlines(data));
      } else {
        setError("Failed to update event");
      }
    } catch {
      setError("Failed to update event");
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (id) => {
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        setEventSuccess("Event deleted!");
        setSelectedEvent(null);
        // Refresh events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
          .then(res => res.json())
          .then(data => setDeadlines(data));
      } else {
        setError("Failed to delete event");
      }
    } catch {
      setError("Failed to delete event");
    }
  };

  // Format date to DD/MM/YYYY
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function getDueStatus(dueDateStr) {
    if (!dueDateStr) return "status-upcoming";
    const dueDate = new Date(dueDateStr);
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "status-overdue"; // Overdue
    if (diffDays <= 90) return "status-expiringsoon"; // Due inside 90 days
    return "status-valid"; // Not due for over 90 days
  }

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h1 className="properties-title">Compliance Manager</h1>
          <div>
            <button
              className="add-property-btn"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              type="button"
              style={{ marginRight: 12 }}
            >
              {uploading ? "Uploading..." : "Upload or Scan Document"}
            </button>
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={uploading}
            />
            <button
              className="add-property-btn"
              type="button"
              onClick={() => setShowEventForm(true)}
            >
              Add Compliance Event
            </button>
          </div>
        </div>

        {/* Modal for Add Compliance Event */}
        {showEventForm && (
          <div className="compliance-modal-overlay" onClick={() => setShowEventForm(false)}>
            <div className="compliance-modal-card" onClick={e => e.stopPropagation()}>
              <h2 className="compliance-modal-title">Add Compliance Event</h2>
              <form className="compliance-add-event-form" onSubmit={handleAddEvent}>
                <select
                  className="compliance-add-event-input"
                  value={newEvent.property_id}
                  onChange={e => setNewEvent(ev => ({ ...ev, property_id: e.target.value }))}
                  required
                >
                  <option value="">Select Property</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} {prop.address ? `- ${prop.address}` : ""}
                    </option>
                  ))}
                </select>
                <input
                  className="compliance-add-event-input"
                  type="text"
                  placeholder="Name (e.g. Gas Safety)"
                  value={newEvent.name}
                  onChange={e => setNewEvent(ev => ({ ...ev, name: e.target.value }))}
                  required
                />
                <input
                  className="compliance-add-event-input"
                  type="text"
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={e => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
                />
                <input
                  className="compliance-add-event-input"
                  type="date"
                  value={newEvent.due_date}
                  onChange={e => setNewEvent(ev => ({ ...ev, due_date: e.target.value }))}
                  required
                />
                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <button className="compliance-add-event-btn" type="submit">
                    Add Event
                  </button>
                  <button
                    className="compliance-modal-close-btn"
                    type="button"
                    onClick={() => setShowEventForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {eventSuccess && <div className="success">{eventSuccess}</div>}
              {error && <div className="error">{error}</div>}
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="compliance-modal-overlay" onClick={() => { setSelectedEvent(null); setEditEvent(null); }}>
            <div className="compliance-modal-card" onClick={e => e.stopPropagation()}>
              <h2 className="compliance-modal-title">Compliance Event Details</h2>
              {!editEvent ? (
                <>
                  <div className="compliance-modal-info">
                    <div><strong>Name:</strong> {selectedEvent.name}</div>
                    <div><strong>Property:</strong> {selectedEvent.property_name}</div>
                    <div><strong>Description:</strong> {selectedEvent.description}</div>
                    <div><strong>Due Date:</strong> {formatDate(selectedEvent.due_date)}</div>
                  </div>
                  <div className="compliance-modal-actions">
                    <button
                      className="compliance-add-event-btn"
                      onClick={() => setEditEvent(selectedEvent)}
                    >
                      Edit
                    </button>
                    <button
                      className="compliance-modal-delete-btn"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="compliance-modal-close-btn"
                      onClick={() => { setSelectedEvent(null); setEditEvent(null); }}
                    >
                      Close
                    </button>
                  </div>
                  {eventSuccess && <div className="success">{eventSuccess}</div>}
                  {error && <div className="error">{error}</div>}
                </>
              ) : (
                <form className="compliance-add-event-form" onSubmit={handleEditEvent}>
                  <select
                    className="compliance-add-event-input"
                    value={editEvent.property_id}
                    onChange={e => setEditEvent(ev => ({ ...ev, property_id: e.target.value }))}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.name} {prop.address ? `- ${prop.address}` : ""}
                      </option>
                    ))}
                  </select>
                  <input
                    className="compliance-add-event-input"
                    type="text"
                    placeholder="Name"
                    value={editEvent.name}
                    onChange={e => setEditEvent(ev => ({ ...ev, name: e.target.value }))}
                    required
                  />
                  <input
                    className="compliance-add-event-input"
                    type="text"
                    placeholder="Description"
                    value={editEvent.description}
                    onChange={e => setEditEvent(ev => ({ ...ev, description: e.target.value }))}
                  />
                  <input
                    className="compliance-add-event-input"
                    type="date"
                    value={editEvent.due_date ? editEvent.due_date.slice(0,10) : ""}
                    onChange={e => setEditEvent(ev => ({ ...ev, due_date: e.target.value }))}
                    required
                  />
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    <button className="compliance-add-event-btn" type="submit">
                      Save
                    </button>
                    <button
                      className="compliance-modal-close-btn"
                      type="button"
                      onClick={() => setEditEvent(null)}
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <div className="error">{error}</div>}
                </form>
              )}
            </div>
          </div>
        )}

        {/* Deadlines & Urgent Reminders */}
        <section className="compliance-section">
          <h2>Upcoming Deadlines & Urgent Reminders</h2>
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Property</th>
                <th>Description</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map(item => (
                <tr key={item.id} onClick={() => { setSelectedEvent(item); setEventSuccess(""); setError(""); }}>
                  <td>{item.name}</td>
                  <td>{item.property_name}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`status-bubble ${getDueStatus(item.due_date)}`}>
                      {formatDate(item.due_date)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Document Expiry Tracker */}
        <section className="compliance-section">
          <h2>Document Expiry Tracker</h2>
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Property</th>
                <th>Uploaded</th>
                {/* Add expiry if your backend provides it */}
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.document_path}</td>
                  <td>{doc.property_name}</td>
                  <td>{formatDate(doc.uploaded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Resource Hub */}
        <section className="compliance-section">
          <h2>Regulation Resource Hub</h2>
          <div className="compliance-resource-grid">
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting/your-landlords-safety-responsibilities"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Landlord Safety Responsibilities</span>
              <span className="compliance-resource-desc">gov.uk guidance on landlord safety duties</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/energy-performance-certificate-commercial-property"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">EPC Rules</span>
              <span className="compliance-resource-desc">Energy Performance Certificate requirements</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/guidance/making-tax-digital-for-vat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Making Tax Digital</span>
              <span className="compliance-resource-desc">Digital tax submission for landlords</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/government/collections/landlord-and-letting-agents-forms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Templates & Forms</span>
              <span className="compliance-resource-desc">Official landlord forms and templates</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/deposit-protection-schemes-and-landlords"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Deposit Protection</span>
              <span className="compliance-resource-desc">Deposit protection scheme rules</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting-tenancy-agreements"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Tenancy Agreements</span>
              <span className="compliance-resource-desc">Tenancy agreement legal requirements</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting-energy-performance-certificates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">EPC for Private Renting</span>
              <span className="compliance-resource-desc">EPC rules for private landlords</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/government/publications/how-to-rent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">How to Rent Guide</span>
              <span className="compliance-resource-desc">Official government guide for tenants and landlords</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}