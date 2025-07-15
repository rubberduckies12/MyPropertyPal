import React, { useState, useEffect } from "react";
import "./mrt.css";
import Sidebar from "../tsidebar/tenantSidebar.jsx";

function getProgressColor(progress) {
  if (progress === "Not Started") return "red";
  if (progress === "In Progress") return "yellow";
  if (progress === "Solved") return "green";
  return "gray";
}

// Map backend severity string to color class
function mapSeverityToColor(severity) {
  if (severity === "Critical" || severity === "High") return "red";
  if (severity === "Medium") return "yellow";
  if (severity === "Low") return "green";
  return "gray";
}

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function MaintenanceRequestsTenant() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    severity: "yellow",
    property_id: "",
  });
  const [propertyOptions, setPropertyOptions] = useState([]);

  // Helper to fetch incidents
  const fetchIncidents = () => {
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/maintenance`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []));
  };

  // Fetch incidents on mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Fetch properties assigned to tenant
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/maintenance/my-properties`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => {
        setPropertyOptions(data.properties || []);
      });
  }, []);

  const handleRowClick = (incident) => setSelectedIncident(incident);
  const handleCloseModal = () => setSelectedIncident(null);

  // Add new maintenance request
  const handleAddIncident = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const severityMap = { red: 4, yellow: 2, green: 1 }; // Adjust to match your incident_severity table
    try {
      const res = await fetch(`${BACKEND_URL}/api/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          property_id: addForm.property_id,
          severity_id: severityMap[addForm.severity],
          title: addForm.title,
          description: addForm.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      setShowAddModal(false);
      setAddForm({ title: "", description: "", severity: "yellow", property_id: "" });
      fetchIncidents(); // Refresh after add
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete maintenance request
  const handleDeleteIncident = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/maintenance/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to delete request");
      setSelectedIncident(null);
      fetchIncidents(); // Refresh after delete
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h2 className="properties-title" style={{ color: "#2563eb" }}>
            Maintenance Requests
          </h2>
          <button
            className="add-property-btn"
            style={{ marginLeft: 18, background: "#2563eb" }}
            onClick={() => setShowAddModal(true)}
          >
            + New Request
          </button>
        </div>
        <div className="incidents-table-container">
          <table className="incidents-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Property Address</th>
                <th>Date Posted</th>
                <th>Severity</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(incident)}
                >
                  <td>{incident.title}</td>
                  <td>{incident.property_address}</td>
                  <td>
                    {new Date(incident.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <span
                      className={
                        "incident-severity severity-" +
                        mapSeverityToColor(incident.severity)
                      }
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        "incident-progress progress-" +
                        getProgressColor(incident.progress)
                      }
                      style={{
                        display: "inline-block",
                        padding: "5px 14px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.98rem",
                        letterSpacing: "0.02em",
                        background:
                          incident.progress === "Solved"
                            ? "#dcfce7"
                            : incident.progress === "In Progress"
                            ? "#fef9c3"
                            : "#fee2e2",
                        color:
                          incident.progress === "Solved"
                            ? "#166534"
                            : incident.progress === "In Progress"
                            ? "#92400e"
                            : "#b91c1c",
                      }}
                    >
                      {incident.progress}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for incident details */}
        {selectedIncident && (
          <div className="incident-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="incident-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseModal}>
                &times;
              </button>
              <h3>{selectedIncident.title}</h3>
              <div className="incident-modal-section">
                <span className={"incident-severity severity-" + mapSeverityToColor(selectedIncident.severity)}>
                  {selectedIncident.severity}
                </span>
                <span
                  className={
                    "incident-progress progress-" +
                    getProgressColor(selectedIncident.progress)
                  }
                  style={{
                    marginLeft: 16,
                    display: "inline-block",
                    padding: "5px 14px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "0.98rem",
                    letterSpacing: "0.02em",
                    background:
                      selectedIncident.progress === "Solved"
                        ? "#dcfce7"
                        : selectedIncident.progress === "In Progress"
                        ? "#fef9c3"
                        : "#fee2e2",
                    color:
                      selectedIncident.progress === "Solved"
                        ? "#166534"
                        : selectedIncident.progress === "In Progress"
                        ? "#92400e"
                        : "#b91c1c",
                  }}
                >
                  {selectedIncident.progress}
                </span>
              </div>
              <div className="incident-modal-section">
                <b>Property:</b> {selectedIncident.property_address}
              </div>
              <div className="incident-modal-section">
                <b>Date Posted:</b>{" "}
                {new Date(selectedIncident.created_at).toLocaleDateString("en-GB")}
              </div>
              <div className="incident-modal-description">
                <b>Description:</b>
                <div style={{ marginTop: 6 }}>{selectedIncident.description}</div>
              </div>
              <button
                className="add-tenant-btn"
                style={{ background: "#d9534f", color: "#fff", marginTop: 18 }}
                onClick={() => handleDeleteIncident(selectedIncident.id)}
              >
                Delete Request
              </button>
            </div>
          </div>
        )}

        {/* Modal for adding a new request */}
        {showAddModal && (
          <div className="incident-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="incident-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
              <h3>New Maintenance Request</h3>
              <form onSubmit={handleAddIncident} className="add-tenant-form">
                <label>
                  Title
                  <input
                    required
                    value={addForm.title}
                    onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    required
                    value={addForm.description}
                    onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  />
                </label>
                <label>
                  Severity
                  <select
                    value={addForm.severity}
                    onChange={e => setAddForm(f => ({ ...f, severity: e.target.value }))}
                  >
                    <option value="red">High</option>
                    <option value="yellow">Medium</option>
                    <option value="green">Low</option>
                  </select>
                </label>
                <label>
                  Property
                  <select
                    required
                    value={addForm.property_id}
                    onChange={e => setAddForm(f => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Select property</option>
                    {propertyOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.address}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="add-tenant-btn" style={{ marginTop: 12 }}>
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}