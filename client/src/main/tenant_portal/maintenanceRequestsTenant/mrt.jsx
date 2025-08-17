import React, { useState, useEffect } from "react";
import Sidebar from "../tsidebar/tenantSidebar.jsx";

function getProgressColor(progress) {
  if (progress === "Not Started") return "bg-red-100 text-red-700";
  if (progress === "In Progress") return "bg-yellow-100 text-yellow-800";
  if (progress === "Solved") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

function mapSeverityToColor(severity) {
  if (severity === "Critical" || severity === "High" || severity === "red") return "bg-red-100 text-red-700";
  if (severity === "Medium" || severity === "yellow") return "bg-yellow-100 text-yellow-800";
  if (severity === "Low" || severity === "green") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

const BACKEND_URL = "https://api.mypropertypal.com";

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
    fetch(`${BACKEND_URL}/api/maintenance`, {
      credentials: "include"
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
    fetch(`${BACKEND_URL}/api/maintenance/my-properties`, {
      credentials: "include"
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
    const severityMap = { red: 4, yellow: 2, green: 1 }; // Adjust to match your incident_severity table
    try {
      const res = await fetch(`${BACKEND_URL}/api/maintenance`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
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
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/maintenance/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete request");
      setSelectedIncident(null);
      fetchIncidents(); // Refresh after delete
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 pt-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
            Maintenance Requests
          </h1>
          <button
            className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            onClick={() => setShowAddModal(true)}
          >
            + New Request
          </button>
        </div>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {incidents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No new maintenance requests
            </div>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 cursor-pointer"
                onClick={() => handleRowClick(incident)}
              >
                <h3 className="text-lg font-bold text-blue-700">
                  {incident.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {incident.property_address}
                </p>
                <div className="text-sm">
                  <strong>Date Posted:</strong>{" "}
                  {new Date(incident.created_at).toLocaleDateString("en-GB")}
                </div>
                <div className="text-sm">
                  <strong>Severity:</strong>{" "}
                  <span
                    className={`px-4 py-1 rounded-xl font-semibold text-sm ${mapSeverityToColor(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Progress:</strong>{" "}
                  <span
                    className={`px-4 py-1 rounded-xl font-semibold text-sm ${getProgressColor(
                      incident.progress
                    )}`}
                  >
                    {incident.progress}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block w-full overflow-x-auto mt-8">
          <table className="min-w-[900px] w-full bg-white rounded-2xl text-base divide-y divide-blue-100">
            <thead>
              <tr>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                  Title
                </th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                  Property Address
                </th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                  Date Posted
                </th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-center">
                  Severity
                </th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8">
                    No new maintenance requests
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => handleRowClick(incident)}
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-700">
                          {incident.title}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">
                          #{incident.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-medium text-black">
                        {incident.property_address}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-gray-600">
                        {new Date(incident.created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`px-4 py-1 rounded-xl font-semibold text-sm ${mapSeverityToColor(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`px-4 py-1 rounded-xl font-semibold text-sm ${getProgressColor(
                          incident.progress
                        )}`}
                      >
                        {incident.progress}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Incident Details Modal */}
        {selectedIncident && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8 flex flex-col gap-6 border border-blue-100 relative">
              <button
                className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-600"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-extrabold text-blue-700 mb-2">
                {selectedIncident.title}
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-2 text-base text-black flex flex-col gap-2">
                <div>
                  <strong className="text-blue-700">Severity:</strong>{" "}
                  <span
                    className={`px-4 py-1 rounded-xl font-semibold text-sm ${mapSeverityToColor(
                      selectedIncident.severity
                    )}`}
                  >
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Progress:</strong>{" "}
                  <span
                    className={`px-4 py-1 rounded-xl font-semibold text-sm ${getProgressColor(
                      selectedIncident.progress
                    )}`}
                  >
                    {selectedIncident.progress}
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Property:</strong>{" "}
                  {selectedIncident.property_address}
                </div>
                <div>
                  <strong className="text-blue-700">Date Posted:</strong>{" "}
                  {new Date(selectedIncident.created_at).toLocaleDateString(
                    "en-GB"
                  )}
                </div>
                <div>
                  <strong className="text-blue-700">Description:</strong>
                  <div className="mt-1">{selectedIncident.description}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1 text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-red-700 transition flex-1 text-sm"
                  onClick={() => handleDeleteIncident(selectedIncident.id)}
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding a new request */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-blue-100 shadow-lg" onClick={e => e.stopPropagation()}>
              <button className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-600" onClick={() => setShowAddModal(false)} aria-label="Close">
                &times;
              </button>
              <h3 className="text-2xl font-extrabold text-blue-700 mb-4">New Maintenance Request</h3>
              <form onSubmit={handleAddIncident} className="flex flex-col gap-4">
                <label className="font-semibold text-blue-700">
                  Title
                  <input
                    required
                    value={addForm.title}
                    onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </label>
                <label className="font-semibold text-blue-700">
                  Description
                  <textarea
                    required
                    value={addForm.description}
                    onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </label>
                <label className="font-semibold text-blue-700">
                  Severity
                  <select
                    value={addForm.severity}
                    onChange={e => setAddForm(f => ({ ...f, severity: e.target.value }))}
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  >
                    <option value="red">High</option>
                    <option value="yellow">Medium</option>
                    <option value="green">Low</option>
                  </select>
                </label>
                <label className="font-semibold text-blue-700">
                  Property
                  <select
                    required
                    value={addForm.property_id}
                    onChange={e => setAddForm(f => ({ ...f, property_id: e.target.value }))}
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  >
                    <option value="">Select property</option>
                    {propertyOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.address}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition mt-4">
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