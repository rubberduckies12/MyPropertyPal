import React, { useState, useEffect } from "react";
import "./incidents.css";
import Sidebar from "../../sidebar/sidebar.jsx";

const progressOptions = [
  { value: "Not Started", color: "red" },
  { value: "In Progress", color: "yellow" },
  { value: "Solved", color: "green" },
];

function getProgressColor(progress) {
  if (progress === "Not Started") return "red";
  if (progress === "In Progress") return "yellow";
  if (progress === "Solved") return "green";
  return "gray";
}

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Fetch all maintenance requests for landlord
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/api/maintenance/landlord", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []));
  }, []);

  // Update progress in backend
  const handleProgressChange = async (id, newProgress) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5001/api/maintenance/landlord/${id}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ progress: newProgress }),
        }
      );
      if (!res.ok) throw new Error("Failed to update progress");
      // Refresh incidents after update
      const updated = await res.json();
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === id ? { ...inc, progress: updated.incident.progress } : inc
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteIncident = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(
        `http://localhost:5001/api/maintenance/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      if (!res.ok) throw new Error("Failed to delete request");
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
      setSelectedIncident(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRowClick = (incident) => setSelectedIncident(incident);
  const handleCloseModal = () => setSelectedIncident(null);

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h2 className="properties-title">Maintenance Requests</h2>
        </div>
        <div className="incidents-table-container">
          <table className="incidents-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Property Address</th>
                <th>Tenant</th>
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
                    {incident.tenant_first_name || ""}{" "}
                    {incident.tenant_last_name || ""}
                  </td>
                  <td>
                    {new Date(incident.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <span
                      className={
                        "incident-severity severity-" +
                        getProgressColor(incident.severity)
                      }
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={
                        "incident-progress progress-" +
                        getProgressColor(incident.progress)
                      }
                      value={incident.progress}
                      onChange={(e) =>
                        handleProgressChange(incident.id, e.target.value)
                      }
                    >
                      {progressOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.value}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
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
                <span
                  className={
                    "incident-severity severity-" +
                    getProgressColor(selectedIncident.severity)
                  }
                >
                  {selectedIncident.severity}
                </span>
                <span style={{ marginLeft: 16 }}>
                  <b>Progress:</b> {selectedIncident.progress}
                </span>
              </div>
              <div className="incident-modal-section">
                <b>Property:</b> {selectedIncident.property_address}
              </div>
              <div className="incident-modal-section">
                <b>Tenant:</b> {selectedIncident.tenant_first_name || ""}{" "}
                {selectedIncident.tenant_last_name || ""}
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
      </main>
    </div>
  );
}