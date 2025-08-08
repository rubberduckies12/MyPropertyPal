import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

function getSeverityColor(severity) {
  if (!severity) return "";
  const s = severity.toLowerCase();
  if (s === "high" || s === "red") return "bg-red-100 text-red-700";
  if (s === "medium" || s === "yellow") return "bg-yellow-100 text-yellow-800";
  if (s === "low" || s === "green") return "bg-green-100 text-green-700";
  return "";
}

function getProgressColor(progress) {
  if (!progress) return "";
  const p = progress.toLowerCase();
  if (p === "not started" || p === "red") return "bg-red-100 text-red-700";
  if (p === "in progress" || p === "yellow") return "bg-yellow-100 text-yellow-800";
  if (p === "solved" || p === "green") return "bg-green-100 text-green-700";
  return "";
}

const BACKEND_URL = "https://api.mypropertypal.com";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/maintenance/landlord`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []));
  }, []);

  const handleProgressChange = async (id, newProgress) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/maintenance/landlord/${id}/progress`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/maintenance/${id}`,
        {
          method: "DELETE",
          credentials: "include"
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
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Maintenance Requests</h1>
        </div>
        <div className="w-full overflow-x-auto mt-8">
          <table className="min-w-[900px] w-full bg-white rounded-2xl text-base divide-y divide-blue-100">
            <thead>
              <tr>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Title</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Property Address</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Tenant</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Date Posted</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-center">Severity</th>
                <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
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
                        <span className="font-semibold text-blue-700">{incident.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">#{incident.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-medium text-black">{incident.property_display}</span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-medium text-black">
                        {incident.tenant_first_name || ""} {incident.tenant_last_name || ""}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-gray-600">
                        {new Date(incident.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className={`px-4 py-1 rounded-xl font-semibold text-sm ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4 px-3" onClick={e => e.stopPropagation()}>
                      <select
                        className={`px-4 py-1 rounded-xl font-semibold text-sm border border-gray-300 focus:ring-2 focus:ring-blue-400 ${getProgressColor(incident.progress)}`}
                        value={incident.progress}
                        onChange={e => handleProgressChange(incident.id, e.target.value)}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Solved">Solved</option>
                      </select>
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
                  <span className={`px-4 py-1 rounded-xl font-semibold text-sm ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Progress:</strong>{" "}
                  <span className={`px-4 py-1 rounded-xl font-semibold text-sm ${getProgressColor(selectedIncident.progress)}`}>
                    {selectedIncident.progress}
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Property:</strong> {selectedIncident.property_display}
                </div>
                <div>
                  <strong className="text-blue-700">Tenant:</strong> {selectedIncident.tenant_first_name || ""} {selectedIncident.tenant_last_name || ""}
                </div>
                <div>
                  <strong className="text-blue-700">Date Posted:</strong>{" "}
                  {new Date(selectedIncident.created_at).toLocaleDateString("en-GB")}
                </div>
                <div>
                  <strong className="text-blue-700">Description:</strong>
                  <div className="mt-1">{selectedIncident.description}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-red-700 transition flex-1"
                  onClick={() => handleDeleteIncident(selectedIncident.id)}
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}