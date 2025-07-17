import React, { useState, useEffect } from "react";
import "./incidents.css";
import Sidebar from "../../sidebar/sidebar.jsx";

function getSeverityColor(severity) {
  if (!severity) return "";
  const s = severity.toLowerCase();
  if (s === "high" || s === "red") return "severity-red";
  if (s === "medium" || s === "yellow") return "severity-yellow";
  if (s === "low" || s === "green") return "severity-green";
  return "";
}

function getProgressColor(progress) {
  if (!progress) return "";
  const p = progress.toLowerCase();
  if (p === "not started" || p === "red") return "progress-red";
  if (p === "in progress" || p === "yellow") return "progress-yellow";
  if (p === "solved" || p === "green") return "progress-green";
  return "";
}

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/maintenance/landlord`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []));
  }, []);

  const handleProgressChange = async (id, newProgress) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/maintenance/landlord/${id}/progress`,
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
        `${BACKEND_URL}/api/maintenance/${id}`,
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
                  <td>
                    <div className="incident-title-cell">
                      <span className="incident-title">{incident.title}</span>
                      <span className="incident-id">#{incident.id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="incident-property">{incident.property_display}</span>
                  </td>
                  <td>
                    <span className="incident-tenant">
                      {incident.tenant_first_name || ""} {incident.tenant_last_name || ""}
                    </span>
                  </td>
                  <td>
                    <span className="incident-date">
                      {new Date(incident.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`incident-severity bubble ${getSeverityColor(incident.severity)}`}
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`incident-progress-select bubble ${getProgressColor(incident.progress)}`}
                      value={incident.progress}
                      onChange={(e) =>
                        handleProgressChange(incident.id, e.target.value)
                      }
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Solved">Solved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedIncident && (
          <div className="incident-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="incident-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseModal}>
                &times;
              </button>
              <h3 className="incident-modal-title">{selectedIncident.title}</h3>
              <div className="incident-modal-section">
                <span
                  className={`incident-severity bubble ${getSeverityColor(selectedIncident.severity)}`}
                >
                  {selectedIncident.severity}
                </span>
                <span style={{ marginLeft: 16 }}>
                  <b>Progress:</b>{" "}
                  <span className={`incident-progress bubble ${getProgressColor(selectedIncident.progress)}`}>
                    {selectedIncident.progress}
                  </span>
                </span>
              </div>
              <div className="incident-modal-section">
                <b>Property:</b> <span className="incident-property">{selectedIncident.property_display}</span>
              </div>
              <div className="incident-modal-section">
                <b>Tenant:</b> <span className="incident-tenant">{selectedIncident.tenant_first_name || ""} {selectedIncident.tenant_last_name || ""}</span>
              </div>
              <div className="incident-modal-section">
                <b>Date Posted:</b>{" "}
                <span className="incident-date">{new Date(selectedIncident.created_at).toLocaleDateString("en-GB")}</span>
              </div>
              <div className="incident-modal-description">
                <b>Description:</b>
                <div style={{ marginTop: 6 }}>{selectedIncident.description}</div>
              </div>
              <button
                className="delete-incident-btn"
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