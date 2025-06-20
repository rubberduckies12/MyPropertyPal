import React, { useState } from "react";
import "./incidents.css";
import Sidebar from "../../sidebar/sidebar.jsx";

const sampleIncidents = [
  {
    id: 1,
    title: "Broken Door",
    property: { address: "123 Main St, London, E1 2AB" },
    tenant: { first_name: "Alice", last_name: "Smith" },
    date_posted: "2024-06-10",
    severity: "red",
    progress: "Not Started",
    description:
      "The front door lock is broken and cannot be secured. Needs urgent repair.",
  },
  {
    id: 2,
    title: "Leaking Tap",
    property: { address: "456 Oak Rd, London, E2 3CD" },
    tenant: { first_name: "Bob", last_name: "Jones" },
    date_posted: "2024-06-12",
    severity: "yellow",
    progress: "In Progress",
    description:
      "The kitchen tap is leaking and causing water to pool on the counter.",
  },
  {
    id: 3,
    title: "Heating Not Working",
    property: { address: "789 Willow Ave, London, E3 4GH" },
    tenant: { first_name: "Charlie", last_name: "Brown" },
    date_posted: "2024-06-13",
    severity: "green",
    progress: "Solved",
    description: "The central heating was not working but has now been fixed.",
  },
];

const progressOptions = [
  { value: "Not Started", color: "red" },
  { value: "In Progress", color: "yellow" },
  { value: "Solved", color: "green" },
];

export default function Incidents() {
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleProgressChange = (id, newProgress) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, progress: newProgress } : inc
      )
    );
  };

  const handleRowClick = (incident) => {
    setSelectedIncident(incident);
  };

  const handleCloseModal = () => {
    setSelectedIncident(null);
  };

  const handleDeleteIncident = (id) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    setSelectedIncident(null);
  };

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h2 className="properties-title">Incidents</h2>
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
                  <td>{incident.property.address}</td>
                  <td>
                    {incident.tenant.first_name} {incident.tenant.last_name}
                  </td>
                  <td>
                    {new Date(incident.date_posted).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <span
                      className={
                        "incident-severity severity-" + incident.severity
                      }
                    >
                      {incident.severity === "red"
                        ? "High"
                        : incident.severity === "yellow"
                        ? "Medium"
                        : "Low"}
                    </span>
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      className={
                        "incident-progress progress-" +
                        progressOptions.find(
                          (opt) => opt.value === incident.progress
                        )?.color
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
                <span className="incident-severity severity-"
                  style={{
                    background:
                      selectedIncident.severity === "red"
                        ? "#fee2e2"
                        : selectedIncident.severity === "yellow"
                        ? "#fef9c3"
                        : "#dcfce7",
                    color:
                      selectedIncident.severity === "red"
                        ? "#b91c1c"
                        : selectedIncident.severity === "yellow"
                        ? "#92400e"
                        : "#166534",
                  }}
                >
                  {selectedIncident.severity === "red"
                    ? "High"
                    : selectedIncident.severity === "yellow"
                    ? "Medium"
                    : "Low"}
                </span>
                <span style={{ marginLeft: 16 }}>
                  <b>Progress:</b> {selectedIncident.progress}
                </span>
              </div>
              <div className="incident-modal-section">
                <b>Property:</b> {selectedIncident.property.address}
              </div>
              <div className="incident-modal-section">
                <b>Tenant:</b> {selectedIncident.tenant.first_name}{" "}
                {selectedIncident.tenant.last_name}
              </div>
              <div className="incident-modal-section">
                <b>Date Posted:</b>{" "}
                {new Date(selectedIncident.date_posted).toLocaleDateString("en-GB")}
              </div>
              <div className="incident-modal-description">
                <b>Description:</b>
                <div style={{ marginTop: 6 }}>{selectedIncident.description}</div>
              </div>
              <button
                className="delete-incident-btn"
                onClick={() => handleDeleteIncident(selectedIncident.id)}
              >
                Delete Incident
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}